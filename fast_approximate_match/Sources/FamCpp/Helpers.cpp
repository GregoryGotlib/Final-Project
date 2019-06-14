#include "StdAfx.h"
#include "Helpers.h"
#include <ostream>
#include <direct.h>
#include <fstream>
#include <sstream>
#include <filesystem>
#include <assert.h>
#include "Logger.h"
#include "Structures.h"

using namespace std;
using namespace logging;

int Helpers::getHammingDistance(const char *source, const char *target) {
	int srcLength = strlen(source);
	int trgLength = strlen(target);
	int distance = 0;
	int length = min(srcLength, trgLength);
	int difference = abs((int)(srcLength - trgLength));

	for (int i = 0; i < length; i++)
	{
		if (source[i] != target[i])
		{
			distance++;
		}
	}

	return distance + difference;
}

int Helpers::getHammingDistance(const char *src, int srcOffset, int srcLength, const char *target, int targetOffset, int trgLength)
{
	int distance = 0;
	int length = min(srcLength, trgLength);
	int difference = abs((int)(srcLength - trgLength));

	for (int i = 0; i < length; i++)
	{
		if (src[srcOffset + i] != target[targetOffset + i])
		{
			distance++;
		}
	}

	return distance + difference;
}

string Helpers::substringOfCString(const char *cstr, size_t start, size_t length)
{
	assert(start + length <= strlen(cstr));
	return std::string(cstr + start, length);
}

bool Helpers::strCmp(const char *str1, const char *str2)
{
	int length = min(strlen(str1), strlen(str2));
	return memcmp(str1, str2, sizeof(char)*length) == 0;
}

string Helpers::GetSeedName(SimilarityCandidate *seed)
{
	return seed->entry.seqPtr->seqData.substr(seed->entry.offset, seed->length);
}

list<string> Helpers::divideToSeeds(const string& pSequence, int sizeOfSeed) {
	if (pSequence.length() < sizeOfSeed) {
		return list<string>{};
	}
	if (pSequence.length() == sizeOfSeed) {
		return list<string>{pSequence};
	}

	list<string> seeds;

	for (int i = 0; i <= pSequence.length() - sizeOfSeed; i++) {
		seeds.push_back(pSequence.substr(i, sizeOfSeed));
	}

	return seeds;
}

void Helpers::createOutputResultDirectory(string const &path)
{
	if (!experimental::filesystem::exists(path.c_str()))
	{
		_mkdir(path.c_str());
	}
}

void Helpers::createPcnFile(unordered_map<int, vector<PcnEntry>> *pcnPtr, int level, string const &outDirPath, int pcnLevelsCount)
{
	vector<PcnEntry>& v = (*pcnPtr)[0];
	PcnEntry& p = v[0];

	string lvlDir = outDirPath + "/Level_" + to_string(level);

	if (!experimental::filesystem::exists(lvlDir.c_str()))
	{
		_mkdir(lvlDir.c_str());
	}

	string path = lvlDir + "/" + p.sequenceName + "_Seed-" + p.seedContent + ".pcn";
	ofstream pcnFile(path);

	pcnFile << "Index, SeedContent, LevelIndex, AncestorIndex, OffsetInSequence, SequenceName" << endl;

	int *levelsSize = new int[pcnPtr->size()];
	for (const auto& pcnLevel : *pcnPtr)
	{
		if (pcnLevel.first == 0)
		{
			levelsSize[pcnLevel.first] = pcnLevel.second.size();
			continue;
		}

		if (pcnLevel.first > pcnLevelsCount)
		{
			throw exception("unexpected level in PCN");
		}
		levelsSize[pcnLevel.first] = levelsSize[pcnLevel.first - 1] + pcnLevel.second.size();
	}

	for (const auto& pcnLevel : *pcnPtr)
	{
		if (pcnLevel.first == 0)
		{
			continue;
		}

		for (int i = 0; i < pcnLevel.second.size(); i++)
		{
			int ancestorInd = (pcnLevel.first == 1) ? 0 :
				pcnLevel.second[i].ancestorIndex + levelsSize[pcnLevel.first - 2];

			pcnFile << i + levelsSize[pcnLevel.first - 1] << ","	//index in file
				<< pcnLevel.second[i].seedContent << ","		//Seed content
				<< pcnLevel.first << ","						//PCN level
				<< ancestorInd << ","							//ancestor index
				<< pcnLevel.second[i].offsetInSeq << ","		//offset in sequence
				<< pcnLevel.second[i].sequenceName << endl;		//sequence name
		}
	}
	pcnFile.close();
}

bool Helpers::checkIfExist(vector<SimilarityCandidate>* candidates, int offset, const string& protName)
{
	for (std::vector<SimilarityCandidate>::iterator candidoz = candidates->begin(); candidoz != candidates->end(); ++candidoz)
	{
		if (candidoz->entry.offset == offset && candidoz->entry.seqPtr->seqName == protName)
		{
			return true;
		}
	}
	return false;
}

void Helpers::createDirectory(const char* path)
{
	if (!experimental::filesystem::exists(path))
	{
		_mkdir(path);
	}
}

bool Helpers::isExists(const char * path)
{
	return experimental::filesystem::exists(path);
}
