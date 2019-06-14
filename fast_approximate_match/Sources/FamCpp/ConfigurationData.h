#ifndef _CONFIGURATIONDATA_H_

#define _CONFIGURATIONDATA_H_

#include <string>

using namespace std;


class ConfigurationData
{


public:
	void load(string path);
	string toString();



public:
	string InputDataDirectory;
	string McsFilePath;
	string TargetSearchSequencesFilePath;
	string OutputResultDirectory;
	string LogDirectory;
	string Alphabet;
	int NumOfThreads;
	int SizeOfSeed;
	int NumOfAllowedMismatches;
	int PcnLevels;
	int FormBufferSize;
	int SequencesPerChunk;
	double ComplexityThreshold;
};

#endif _CONFIGURATIONDATA_H_
