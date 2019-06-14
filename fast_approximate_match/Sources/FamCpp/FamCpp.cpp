#pragma warning(disable : 4996) //_CRT_SECURE_NO_WARNINGS

#undef _HAS_STD_BYTE

#include "stdafx.h"
//#define ENABLE_EXTRA_PRINTS
//#define CREATE_FULL_PCN

//required for Sleep
#include <windows.h>

#include <iostream>
#include <list>
#include <fstream>
#include <algorithm>
#include <sstream>
#include <unordered_map>
#include <cmath>
#include <direct.h>
#include <vector>
#include <chrono>
#include <thread>
#include <string>
#include <iomanip>
#include "ConfigurationData.h"
#include "Structures.h"
#include "DataProvider.h"
#include "Helpers.h"
#include "PcnBuilder.h"
#include "Logger.h"
#include"ThreadPool.h"
#include "Serializer.h"
#include "MappingInfo.h"

using namespace std;
using namespace chrono;
using namespace logging;

typedef steady_clock timer;

#define VERSION 1.5
#define FORM_BUFFER_SIZE 10

Logger* logger;

//GLOBAL VARS

//create map <key, value> for each thread, where:
//	key - input sequence
//	value - list of all mapped words
unordered_map<string, vector<MappedEntry>> *_allTextMap;

//create map <key, value> for each thread, where:
//	key - QuerySeed - details about PCN entry the value belongs to
//	value - vector of Similarity Candidates (i.e. max number of subPCNs for one PCN will be as number of threads)
//  This structure should be cleaned upon each end of SMALL cycle (during processing of one part of HUGE input text)
unordered_map<QuerySeed, vector<SimilarityCandidate>> *_subPcns;

//create map <key, value>:
//  key - index of nothing
//  value - map of vectors of PcnEntry per level(key - level)
//  where each vector<PcnEntry> represents result of merging globalSubPcn vectors (as NUM_OF_THREADS) to one common vector per seed.
unordered_map<QuerySeed, unordered_map<int, vector<PcnEntry>>> _mergedPcns;

//input proteins data
vector<FastaEntry> _seqDataList;
list<McsData> _mcsList;
//input sequences data for search
vector<QueryData> _queries;

ConfigurationData _confData;
PcnBuilder* _pcnBuilder;
ThreadPool* _threadPool;
DataProvider* _dataProvider;
int _pcnLevel = 1;
bool _continueWithDump;

//FUNCTIONS DECLARATIONS
void SplitQueriesToSeeds(int sizeOfSeed);
void mappingThread(int startIndex, int endIndex, int bucket);
void findCandidatesThread(int bucket, int nextlevel);


void clearAllTextMapThread(int bucket)
{
	_subPcns[bucket].clear();
	for_each(_allTextMap[bucket].begin(), _allTextMap[bucket].end(), [](std::unordered_map<string, vector<MappedEntry>>::value_type& p)
	{
		p.second.clear();
	});
	_allTextMap[bucket].clear();
	//LOG_INFO_BROADCAST("_allTextMap[" + std::to_string(bucket) + "] size = " +  std::to_string(_allTextMap[bucket].size()));
}

void mapDataChunk(int numOfThreads)
{
	int indexStep = _seqDataList.size() / numOfThreads;
	std::vector< std::future<void> > results;
	timer::time_point start = timer::now();
	//MAPPING parallel processing
	for (int i = 0; i < numOfThreads; i++)
	{
		int startIndex = i * indexStep;
		int endIndex = startIndex + indexStep - 1;
		if (i == numOfThreads - 1)
		{
			endIndex = _seqDataList.size() - 1;
		}

		results.emplace_back(_threadPool->enqueue(&mappingThread, startIndex, endIndex, i));
		//threads.push_back(thread(mappingThread, startIndex, endIndex, i));
	}

	for (auto && result : results)
	{
		result.get();
	}

	timer::time_point end = timer::now();
	auto time_span = duration_cast<duration<double>>(end - start);
	LOG_DEBUG("Mapping completed in " + std::to_string(time_span.count()) + " seconds.");
}

bool loadConfiguration()
{
	try
	{
		_confData.load("Configuration.json");
	}
	catch (char* excp)
	{
		throw "Error reading Configuration.json file: " + string(excp);
	}
}

/**
*	\brief PREPATATORY PHASE.
*
*	Description:
*					performing all tasks required for cyclic processing of input data chunks.
*	Tasks:
*		1.Reading file with MCS patterns,
*		1.1.Processing "list<McsData> mcsList"
*		2.Reading file with Queries(sequences to search).
*		2.1.Processing list of all seeds to be searched in input. Marking list of splitted seeds as level with index "0" in mergedPcn map
*			Each such PcnEntry will contain ONLY seed content and sequence name taken from QueryData structure
*			The key of mergedPcn is the QuerySeed structure describes the query name and Seed content
*/
void initialize()
{
	ostringstream ss;
	ss << "Fast Approximate Match App. v " << VERSION;
	string sTemp = ss.str();
	SetConsoleTitle(wstring(sTemp.begin(), sTemp.end()).c_str());
	LOG_INFO_BROADCAST(ss);
	LOG_INFO_BROADCAST(_confData.toString());

	_allTextMap = new unordered_map<string, vector<MappedEntry>>[_confData.NumOfThreads];
	_subPcns = new unordered_map<QuerySeed, vector<SimilarityCandidate>>[_confData.NumOfThreads];
	_pcnBuilder = new PcnBuilder(&_mcsList, _allTextMap, _confData);
	_threadPool = new ThreadPool(_confData.NumOfThreads);

	try
	{
		Helpers::createOutputResultDirectory(_confData.OutputResultDirectory);
	}
	catch (char* excp)
	{
		std::stringstream ss;
		ss << "Error creating output result directory " << _confData.OutputResultDirectory << ". Exception: " << excp;
		throw ss.str();
	}

	_dataProvider = new DataProvider(_confData.SizeOfSeed);

	//read all input data

	if (!Helpers::isExists(_confData.McsFilePath.c_str()))
	{
		throw "MCS file doesn't exist. Check path: " + _confData.McsFilePath;
	}

	_mcsList = _dataProvider->readMcsFile(_confData.McsFilePath);

	if (!Helpers::isExists(_confData.TargetSearchSequencesFilePath.c_str()))
	{
		throw "File with target sequences doesn't exist. Check path: " + _confData.TargetSearchSequencesFilePath;
	}

	try
	{
		_dataProvider->loadQueries(&_queries, _confData.TargetSearchSequencesFilePath);
	}
	catch (char* excp)
	{
		throw "Error loading queries: " + string(excp);
	}

	//obtain data for all seeds who participate in the search
	SplitQueriesToSeeds(_confData.SizeOfSeed);

	LOG_INFO_BROADCAST("Start PCN creation for directory: " + _confData.InputDataDirectory);

	if (!Helpers::isExists(_confData.InputDataDirectory.c_str()))
	{
		throw "PCN creation directory doesn't exist. Check path: " + _confData.InputDataDirectory;
	}
}

int main(int argc, char *argv[])
{
	try
	{
		loadConfiguration();

		Logger::setLogDirectory(_confData.LogDirectory);
		_continueWithDump = argc >= 3 && Helpers::strCmp(argv[1], "-d");
		if (_continueWithDump)
		{
			try
			{
				Serializer::deserializePcnMap(argv[2], &_mergedPcns, &_pcnLevel);
			}
			catch (char* excp)
			{
				throw "Error serializing dump file file: " + string(argv[2]) + ". " + string(excp);
			}
		}

		initialize();

		//CYCLING PHASE (PER ONE PCN LEVEL CREATION)
		// 1.MAPPING SUBPHASE
		// 1.1.Fetching part of input HUGE text
		// 1.2.Dividing that part to equal chunks (the number of chunks defined as NUM_OF_THREADS)
		// 1.3.Mapping each chunk to map  allTextMap[NUM_OF_THREADS]
		// 2.SUBPCN SEARCHING SUBPHASE
		// 2.1.For each PcnEntry in mergedPcns (created in preparatory PHASE) map we are looking for vector<SimilarityCandidates>.
		//	The number of such vector<SimilarityCandidates> vectors is less or equal to NUM_OF_THREADS
		// 2.2 Merging the vector<SimilarityCandidates> vectors to one global vector<PcnEntry> subPcns map.
		//		The merge eliminates all seeds having the equal position in Original huge text.
		// 2.3 Clearing all structures should be used in the next cycle:
		//		- unordered_map<string, vector<MappedEntry*>> allTextMap[NUM_OF_THREADS];
		//		- unordered_map<int, vector<SimilarityCandidate>> subPcns[NUM_OF_THREADS];

		//main MAPPING loop

		timer::time_point operationStart = timer::now();
		timer::time_point start = timer::now();
		timer::time_point internalTimer;
		vector<path> allFileNames;

		_dataProvider->getFiles(_confData.InputDataDirectory, &allFileNames);
		LOG_INFO(_confData.InputDataDirectory + " contains of " + to_string(allFileNames.size()) + " files");

		MappingInfo mappingInfo(allFileNames.size());

		//vector<vector<vector<double>>> chunksTimingData;
		//chunksTimingData.push_back(vector<vector<double>>());

		//for each level
		for (int lvl = _pcnLevel; lvl <= _confData.PcnLevels; lvl++)
		{
			LOG_INFO_BROADCAST("Level " + std::to_string(lvl) + ": Start mapping, candidates search AND merge procedures");
			start = timer::now();
			for (int fileIndex = 0; fileIndex < allFileNames.size(); fileIndex++)
			{
				//inputDataFileName = allFileNames[fileIndex].string();
				LOG_DEBUG("file in process " + allFileNames[fileIndex].string());
				size_t fileOffset = 0;

				//read sequences chunk by chunk
				for (int chunkIndex = 0; fileOffset != -1; chunkIndex++)
				{
					ostringstream ss;
					ss << "File " << allFileNames[fileIndex].string() << ". Chunk# " << chunkIndex << endl;
					_dataProvider->readDataFile(&_seqDataList, allFileNames[fileIndex].string(), &fileOffset, _confData.SequencesPerChunk);

					timer::time_point startMapChunk = timer::now();
					mapDataChunk(_confData.NumOfThreads);
					auto ts = duration_cast<duration<double>>(timer::now() - startMapChunk);
					LOG_DEBUG("Level " + std::to_string(lvl) + ".Mapping for chunk# " + std::to_string(chunkIndex) + " of file " + allFileNames[fileIndex].string() + " took " + std::to_string(ts.count()) + " seconds.");

					//chunksTimingData[fileIndex][chunkIndex].push_back(ts.count());
					mappingInfo.AddTime(fileIndex, chunkIndex, ts.count());
					std::vector< std::future<void> > mapPool;

					internalTimer = timer::now();
					for (int i = 0; i < _confData.NumOfThreads; i++)
					{
						mapPool.emplace_back(_threadPool->enqueue(findCandidatesThread, i, lvl));
					}

					for (auto && result : mapPool)
					{
						result.get();
					}

					ss << "Find candidates completed within " <<
						duration_cast<duration<double>>(timer::now() - internalTimer).count() << " seconds." << endl;
					//MERGING
					//merge all subPCNs for current chunk into global PCN
					internalTimer = timer::now();
					for (const auto& pcn : _subPcns[0])
					{
						for (int i = 0; i < _confData.NumOfThreads; i++)
						{
							if (_subPcns[i][pcn.first].size() > 0)
							{
								_pcnBuilder->appendPcnEntries(&(pcn.first), &_mergedPcns[pcn.first], &_subPcns[i][pcn.first], lvl);
							}
						}
					}
					ss << "Merging completed within " <<
						duration_cast<duration<double>>(timer::now() - internalTimer).count() << " seconds." << endl;

					//CLEAR structures before next cycle
					internalTimer = timer::now();
					_seqDataList.clear();
					std::vector< std::future<void> > cleanPool;

					for (int i = 0; i < _confData.NumOfThreads; i++)
					{
						cleanPool.emplace_back(_threadPool->enqueue(clearAllTextMapThread, i));
					}

					for (auto && result : cleanPool)
					{
						result.get();
					}

					ss << "Structures CleanUp completed within " <<
						duration_cast<duration<double>>(timer::now() - internalTimer).count() << " seconds." << endl;
					LOG_DEBUG(ss);
				}
			}

			auto end = timer::now();
			auto time_span = duration_cast<duration<double>>(end - start);
			LOG_INFO_BROADCAST("Level " + to_string(lvl) + ": Mapping, candidates search AND merge procedures have been completed within " + to_string(time_span.count()) + " seconds");

			Serializer::serializePcnMap(_mergedPcns, _confData.OutputResultDirectory, lvl);

			unordered_map<QuerySeed, unordered_map<int, vector<PcnEntry>>> deserializedMap;

			/*string path = "C:\\Users\\Alexander\\source\\Repos\\fastapproximatematch\\ConfigurationDataExamples\\DebugSet\\Results\\Level_1\\pcnDump_lvl_1.pcnDump";
			int targetLevel;
			Serializer::deserializePcnMap(path, &deserializedMap, &targetLevel);
	*/
	//creating PCN files is done only after all chunks of data for all levels processed
			for (const auto& pcnPair : _mergedPcns)
			{
				unordered_map<int, vector<PcnEntry>> pcn = pcnPair.second;
				if (pcn[1].size() > 0)
				{
					try
					{
						Helpers::createPcnFile(&pcn, lvl, _confData.OutputResultDirectory, _confData.PcnLevels);
					}
					catch (const std::exception& e)
					{
						LOG_ERROR_BROADCAST("failed to create PCN file. Exception: " + string(e.what()));
					}
				}
			}
		}

		//LAST PHAZE
		mappingInfo.AddToLog(allFileNames);

		auto end = timer::now();
		auto time_span = duration_cast<duration<double>>(end - operationStart);
		LOG_INFO_BROADCAST("All procedure completed in:" + std::to_string(time_span.count()) + " seconds.");
		getchar();
		return 0;
	}
	catch (string excp)
	{
		LOG_ERROR_BROADCAST(string(excp));
		getchar();
		return -1;
	}
	catch (char *excp)
	{
		LOG_ERROR_BROADCAST(string(excp));
		getchar();
		return -1;
	}
	catch (...) 
	{
		LOG_ERROR_BROADCAST("Unhandled exception");
	}
}

void findCandidatesThread(int bucket, int curLevel)
{
	unordered_map<int, vector<PcnEntry>>::const_iterator it;
	for (const auto& pcnPair : _mergedPcns)
	{
		it = pcnPair.second.find(curLevel - 1);
		if (it == pcnPair.second.end())
		{
			//we here, i.e. previous level for current PCN is not exist.
			//Then there is nothing to search for the next level.
			//NPPR situation.
			continue;
		}

		_subPcns[bucket][pcnPair.first] = vector<SimilarityCandidate>();
		for (int i = 0; i < it->second.size(); i++)
		{
			if (!it->second[i].hasDuplicatedContent)
			{
				_pcnBuilder->findSimilarToSeed(it->second[i].seedContent.c_str(), i, bucket, &_subPcns[bucket][pcnPair.first]);
			}
		}
	}
}

void mappingThread(int startIndex, int endIndex, int bucket) {
	/*if (bucket == 8)
	{
		return;
	}*/

	//SetThreadPriority(GetCurrentThread(), THREAD_PRIORITY_TIME_CRITICAL);
	//LOG_INFO("Mapping thread# " + std::to_string(bucket) + ". Start index: " + std::to_string(startIndex) + ". End index: " + std::to_string(endIndex));
	stringstream ss;
	char buffer[FORM_BUFFER_SIZE];
	int currentStreamIndex = 0;

	//foreach MCS form
	for (list<McsData>::iterator currentMcs = _mcsList.begin(); currentMcs != _mcsList.end(); ++currentMcs) {
		//foreach FastaEntry(sequence)
		for (int i = startIndex; i < endIndex; i++) {
			ss << _seqDataList[i].seqData << endl;
			currentStreamIndex = 0;

			while (currentStreamIndex <= _seqDataList[i].seqData.length() - (*currentMcs).formLength)
			{
				ss.seekg(currentStreamIndex, ss.beg);
				ss.read(buffer, (*currentMcs).formLength);

				buffer[(*currentMcs).formLength] = '\0';

				for (auto it = (*currentMcs).missIndexes.begin(); it != (*currentMcs).missIndexes.end(); ++it)
				{
					buffer[*it] = '.';
				}
				MappedEntry mappedEntry;

				mappedEntry.indexInSeq = currentStreamIndex;
				mappedEntry.seqPtr = &_seqDataList[i];

				string s = string(buffer);

				_allTextMap[bucket][s].push_back(mappedEntry);
				currentStreamIndex++;
			}

			//empty stream + clear errors bits
			ss.str("");
			ss.clear();
		}
	}

	//close stream
	ss.flush();
	//LOG_DEBUG("Thread " + std::to_string(bucket) + "mapping done at " + currTimeToStr() + ".");
}

void SplitQueriesToSeeds(int sizeOfSeed)
{
	//for each query
	for (int i = 0; i < _queries.size(); i++)
	{
		int offset = 0;
		//for each seed in query
		//for each query go over data in sequence and create map for future PCN
		for (std::string::iterator seqIt = _queries[i].data.begin(); seqIt != _queries[i].data.end() && _queries[i].data.end() - seqIt > sizeOfSeed; ++seqIt, offset++)
		{
			QuerySeed q;
			q.queryIndex = i;
			q.seedContent = string(seqIt, seqIt + sizeOfSeed);

			PcnEntry p;
			p.seedContent = q.seedContent;
			p.sequenceName = _queries[i].name;
			p.offsetInSeq = offset;
			p.ancestorIndex = 0;

			vector<PcnEntry> v;
			v.push_back(p);

			//set level index to 0
			unordered_map<int, vector<PcnEntry>> m;
			m[0] = v;
			_mergedPcns[q] = m;
		}
	}
}