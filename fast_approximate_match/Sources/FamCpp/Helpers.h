#pragma once

#include "Structures.h"
#include <sstream>
using namespace std;

class Helpers
{
public:

	struct stringbuilder
	{
		std::stringstream ss;
		template<typename T>
		stringbuilder & operator << (const T &data)
		{
			ss << data;
			return *this;
		}
		operator std::string() { return ss.str(); }
	};

	static int getHammingDistance(const char *source, const char *target);
	static int getHammingDistance(const char * src, int srcOffset, int srcLength, const char * target, int targetOffset, int targetLength);
	static bool strCmp(const char * str1, const char * str2);
	static string GetSeedName(SimilarityCandidate *seed);
	static list<string> divideToSeeds(const string& pSequence, int sizeOfSeed);
	static void createPcnFile(unordered_map<int, vector<PcnEntry>> *pcnPtr, int level, string const &outDirPath, int pcnLevelsCount);
	static bool checkIfExist(vector<SimilarityCandidate>* candidates, int offset, const string& protName);
	static string substringOfCString(const char *cstr, size_t start, size_t length);
	static void createOutputResultDirectory(string const &path);
	static void serializeMergedPcnsMap(unordered_map<QuerySeed, unordered_map<int, vector<PcnEntry>>>& map, string const &outDirPath, int level);
	static void createDirectory(const char* path);
	static bool isExists(const char* path);


private:
	// Disallow creating an instance of this object
	Helpers() {}
};

