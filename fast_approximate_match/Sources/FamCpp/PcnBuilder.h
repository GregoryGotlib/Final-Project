#pragma once

#include "Structures.h"
#include "ConfigurationData.h"
#include <unordered_map>

using namespace std;

class PcnBuilder
{
	list<McsData> *mcsList;
	unordered_map<string, vector<MappedEntry>> *allTextMap;
	int sizeOfSeed;
	int numOfAllowedMismatches;
	double complexityThreshold;
	string alphabet;

	string createPcnName(string pProteinName, string pSeedName);
	string createProteinDirName(string pProteinName);
	bool checkComplexity(const MappedEntry& seed, int length);

public:
	PcnBuilder(list<McsData> *mcsListPtr, unordered_map<string, vector<MappedEntry>> *allTextMapPtr, ConfigurationData const &confData);
	bool canCreatePcn(string pSeed, string pProteinName, PcnData *pcnData);
	void findSimilarToSeed(const char * seedPtr, int seedIndex, int bucket, vector<SimilarityCandidate>* candidates);
	void appendPcnEntries(const QuerySeed * querySeedPtr, unordered_map<int, vector<PcnEntry>>* pcnPtr, vector<SimilarityCandidate>* subPcn, int level);
};