#pragma once
#ifndef _STRUCTURES_H_
#define _STRUCTURES_H_

#include <list>
#include <vector>
#include <chrono>
#include <string>
#include <algorithm>
#include <unordered_map>

using namespace std;
using namespace chrono;

typedef steady_clock timer;

//DATA TYPES DECLARATIONS

//protein sequence of Fasta format
struct FastaEntry
{
	string seqName;
	string seqData;
};

//entry mapped with MCS pattern
struct MappedEntry
{
	int indexInSeq;
	FastaEntry* seqPtr;
};

//describes the starting position of seed relatively to input(Fasta) sequence
struct SeedEntry
{
	int offset;
	FastaEntry* seqPtr;

	bool operator == (SeedEntry s)
	{
		return s.offset == offset && s.seqPtr == seqPtr;
	}
};

struct PcnEntry
{
	//seed content (SIZE_OF_SEED symbols)
	//for level -1 this field describes seed content
	// taken from QueryData structure
	string seedContent;

	//protein sequence name
	//for level -1 this field describes sequence name
	// taken from QueryData structure
	string sequenceName;

	//offset in protein sequence
	int offsetInSeq;

	//index of ancestor in list related to previous level.
	//Ancestor can be only on previous level. NOT on other else level!
	int ancestorIndex;

	//if true, then PcnEntry with such content already exists on current level,
	//It means that this PcnEntry can not further participate in PCN creation ,
	//i.e. it can not be ancestor
	bool hasDuplicatedContent = false;

	bool operator == (PcnEntry p)
	{
		return p.offsetInSeq == offsetInSeq
			&& p.ancestorIndex == ancestorIndex
			&& p.seedContent == seedContent
			&& p.sequenceName == sequenceName;
	}

	std::ostream& PcnEntry::serialize(std::ostream &out) const
	{

		int size = seedContent.size();
		out.write((char*)&size, sizeof(int));
		out.write((char*)seedContent.c_str(), size);

		size = sequenceName.size();
		out.write((char*)&size, sizeof(int));
		out.write((char*)sequenceName.c_str(), size);

		out.write((char*)&offsetInSeq, sizeof(int));
		out.write((char*)&ancestorIndex, sizeof(int));
		out.write((char*)&hasDuplicatedContent, sizeof(bool));
		return out;
	}

	std::istream& PcnEntry::deserialize(std::istream &in)
	{
		if (in)
		{
			int len = 0;
			in.read((char *)&len, sizeof(int));//deserialize size of string

			if (in && len)
			{
				std::vector<char> tmp(len);
				in.read(tmp.data(), len); //deserialize characters of string
				seedContent.assign(tmp.data(), len);
			}

			in.read((char *)&len, sizeof(int));//deserialize size of string
			if (in && len)
			{
				std::vector<char> tmp(len);
				in.read(tmp.data(), len); //deserialize characters of string
				sequenceName.assign(tmp.data(), len);
			}
			if (in) 
			{
				in.read((char *)&offsetInSeq, sizeof(int));
			}

			if (in)
			{
				in.read((char *)&ancestorIndex, sizeof(int));
			}

			if (in)
			{
				in.read((char *)&hasDuplicatedContent, sizeof(bool));
			}

		}
		return in;
	}
};

struct SimilarityCandidate
{
	int length;
	//describes position of candidate in AllTextMap structure
	SeedEntry entry;
	//index of ancestor in vector<PcnEntry> on previous PCN level
	int ancestorIndex;
};

//MCS form
struct McsData
{
	string form;
	int formLength;
	list<int> missIndexes;
};

struct PcnData
{
	vector<PcnEntry> pcn;
	string proteinDirName;
	string seedFileName;
};

struct QueryData
{
	string name;
	string data;
};

struct QuerySeed
{
	int queryIndex;
	string seedContent;

	bool operator==(const QuerySeed &other) const
	{
		return (queryIndex == other.queryIndex	&& seedContent == other.seedContent);
	}

	std::ostream& QuerySeed::serialize(std::ostream &out) const
	{
		out.write((char*)&queryIndex, sizeof(int));
		int size = seedContent.size();
		out.write((char*)&size, sizeof(int));
		out.write((char*)seedContent.c_str(), size);
		return out;
	}

	std::istream& QuerySeed::deserialize(std::istream &in)
	{
		if (in) 
		{
			int len = 0;
			in.read((char *)&queryIndex, sizeof(int));
			in.read((char *)&len, sizeof(int));//deserialize size of string
			if (in && len) 
			{
				std::vector<char> tmp(len);
				in.read(tmp.data(), len); //deserialize characters of string
				seedContent.assign(tmp.data(), len);
			}
		}
		return in;
	}
};

template<>
struct hash<QuerySeed>
{
	std::size_t operator()(const QuerySeed& k) const
	{
		using std::size_t;
		using std::hash;
		using std::string;

		// Compute individual hash values for queryName
		// and seedContent and combine them using XOR
		// and bit shifting:

		return ((hash<int>()(k.queryIndex)
			^ (hash<string>()(k.seedContent) << 1)) >> 1);
	}
};

#endif // End of _STRUCTURES_H_