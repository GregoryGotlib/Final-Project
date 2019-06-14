#include "StdAfx.h"
#include "DataProvider.h"
#include <chrono>
#include <ostream>
#include <filesystem>
#include "Logger.h"

using namespace std;
using namespace chrono;
using namespace experimental::filesystem;
using namespace logging;
typedef steady_clock timer;

int _sizeOfSeed;
DataProvider::DataProvider(int sizeOfSeed)
{
	_sizeOfSeed = sizeOfSeed;
}

//read forms from MCS file
list<McsData> DataProvider::readMcsFile(const string& mcsFileName) 
{
	ifstream mcsFile(mcsFileName);
	ostringstream ss;
	ss << "mcs forms are:" << endl;

	for (string line; getline(mcsFile, line); )
	{
		McsData newForm;

		newForm.form = line;
		newForm.formLength = line.length();

		//we need this to initialize buffer array of chars
		if (newForm.formLength > maxMcsFormLength) {
			maxMcsFormLength = newForm.formLength;
		}

		size_t pos = newForm.form.find('.', 0);

		//fill indexes of mismatches
		while (pos != string::npos)
		{
			newForm.missIndexes.push_back((int)pos);
			pos = newForm.form.find('.', pos + 1);
		}

		mcsList.push_back(newForm);

		ss << newForm.form << endl;
	}
	LOG_INFO_BROADCAST(ss);
	mcsFile.close();

	return mcsList;
}

void DataProvider::getFiles(const string& directoryPath, vector<path> *files)
{
	for (std::experimental::filesystem::directory_entry p : std::experimental::filesystem::directory_iterator(directoryPath))
	{
		files->push_back(p.path());
	}
}

//read sequences data file
void DataProvider::readDataFile(vector<FastaEntry> *seqDataList, const string& dataFileName, size_t *fileOffset, int sequencesPerChunk)
{
	ifstream dataFile(dataFileName);

	dataFile.seekg(*fileOffset, dataFile.beg);
	timer::time_point start = timer::now();

	int i = 0;

	for (string lineHeader, lineBody; getline(dataFile, lineHeader), i < sequencesPerChunk && !dataFile.eof(); i++)
	{
		FastaEntry newEntry;

		getline(dataFile, lineBody, '>');

		lineBody.erase(remove(lineBody.begin(), lineBody.end(), '\n'), lineBody.end());

		try
		{
			newEntry.seqName = lineHeader.substr(1, lineHeader.length() - 1);
			newEntry.seqData = lineBody;

			if (newEntry.seqData.length() < _sizeOfSeed)
			{
				continue;
			}
			(*seqDataList).push_back(newEntry);
		}
		catch (const std::exception& e)
		{
			LOG_ERROR_BROADCAST("Unexpected sequence " + to_string(i) + " in offset " + to_string(*fileOffset) + " of file: " + dataFileName + ". Exception: " + string(e.what()));
			continue;
		}

		/*if (dataFile.eof()) 
		{
			int s = (*seqDataList).size();
		}*/

	}

	*fileOffset = dataFile.eof() ? -1 : dataFile.tellg();

	timer::time_point end = timer::now();
	auto time_span = std::chrono::duration_cast<duration<double>>(end - start);
	LOG_DEBUG("Finished reading data file. Sequences in data text:" + to_string((*seqDataList).size()));
	LOG_DEBUG("Time:" + to_string(time_span.count()) + " seconds.");
}

void DataProvider::loadQueries(vector<QueryData> *pQueries, const string& queriesFileName)
{
	ifstream queriesFile(queriesFileName);

	timer::time_point start = timer::now();

	//need to jump over first '>' symbol
	string junk;
	getline(queriesFile, junk, '>');

	for (std::string qHeader, qBody; getline(queriesFile, qHeader);)
	{
		QueryData newQuery;

		getline(queriesFile, qBody, '>');

		qBody.erase(std::remove(qBody.begin(), qBody.end(), '\n'), qBody.end());
		if (qBody.length() < _sizeOfSeed)
		{
			continue;
		}

		newQuery.name = qHeader;
		transform(qBody.begin(), qBody.end(), qBody.begin(), ::toupper);
		newQuery.data = qBody;

		pQueries->push_back(newQuery);
	}

	timer::time_point end = timer::now();
	auto time_span = duration_cast<duration<double>>(end - start);
	ostringstream ss;
	if(!pQueries->size())
	{
		//TODO: throw exception here
	}

	ss << "Loaded " << pQueries->size() << " target sequiences from file ";
	ss << queriesFileName << " within " << to_string(time_span.count()) + " seconds.";
	LOG_INFO_BROADCAST(ss);
}