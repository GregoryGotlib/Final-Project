#include "stdafx.h"
#include "ConfigurationData.h"
#include <iostream>
#include <fstream>
#include <ostream>
#include "json/json.h"

using namespace std;
using namespace Json;

void ConfigurationData::load(string path)
{
	Json::Value root;
	Json::CharReaderBuilder builder;
	std::ifstream confFile("Configuration.json", ifstream::binary);
	std::string errs;
	if (!Json::parseFromStream(builder, confFile, &root, &errs))
	{
		throw errs;
	}

	InputDataDirectory = root["InputData"].asCString();
	McsFilePath = root["McsFilePath"].asCString();
	TargetSearchSequencesFilePath = root["SequencesToSearch"].asCString();
	OutputResultDirectory = root["OutputResultDirectory"].asCString();
	LogDirectory = root["LogDirectory"].asCString();
	Alphabet = root["Alphabet"].asCString();

	NumOfThreads = root["NumOfThreads"].asInt();
	SizeOfSeed = root["SizeOfSeed"].asInt();
	NumOfAllowedMismatches = root["NumOfAllowedMismatches"].asInt();
	PcnLevels = root["PcnLevels"].asInt();
	FormBufferSize = root["FormBufferSize"].asInt();
	SequencesPerChunk = root["SequencesPerChunk"].asInt();
	ComplexityThreshold = root["ComplexityThreshold"].asDouble();

	confFile.close();
}

string ConfigurationData::toString()
{
	ostringstream ss;
	ss << "Configuration parameters: " << endl;
	ss << "\t\tNumber of threads: " << NumOfThreads << endl;
	ss << "\t\tAlphabet: " << Alphabet << endl;
	ss << "\t\tComplexity threshold " << ComplexityThreshold << endl;
	ss << "\t\tSize of SEED: " << SizeOfSeed << endl;
	ss << "\t\tMaximum number of allowed mismatches: " << NumOfAllowedMismatches << endl;
	ss << "\t\tPCN levels: " << PcnLevels << endl;
	ss << "\t\tForm buffer size: " << FormBufferSize << endl;
	ss << "\t\tMaximal count of sequences per chunk: " << SequencesPerChunk << endl;
	return ss.str();
}