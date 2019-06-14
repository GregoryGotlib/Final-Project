#pragma once

#include "Structures.h"
#include <filesystem>

using namespace std;
using namespace experimental::filesystem;

class DataProvider
{
	int maxMcsFormLength = 0;

public:
	DataProvider(int sizeOfSeed);
	list<McsData> readMcsFile(const string& mcsFileName);
	void getFiles(const string& directoryPath, vector<path> *files);
	void readDataFile(vector<FastaEntry> *seqDataList, const string& dataFileName, size_t *fileOffset, int sequencesPerChunk);
	void loadQueries(vector<QueryData> *pQueries, const string& queriesFileName);
	list<McsData> mcsList;
};