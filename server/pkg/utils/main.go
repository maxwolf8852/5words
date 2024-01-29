package utils

import (
	"bufio"
	"encoding/csv"
	"fmt"
	"io"
	"log"
	"os"
	"strings"
)

func GetDefEnv(env string, def string) string {
	e, prov := os.LookupEnv(env)
	if !prov {
		e = def
	}
	return e
}

func ReadCsvFile(filePath string) []string {
	records := make([]string, 0)
	f, err := os.Open(filePath)
	if err != nil {
		log.Fatal("Unable to read input file "+filePath, err)
	}
	defer f.Close()

	fi, _ := f.Stat()

	fmt.Println(fi.Size() / 1024)

	csvReader := csv.NewReader(f)
	csvReader.Comma = '	'
	csvReader.LazyQuotes = true
	csvReader.FieldsPerRecord = 22
	for {
		record, err := csvReader.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			log.Fatal(err)

		}

		//fmt.Println(record)
		if len(record) > 0 {
			records = append(records, record[0])
		}

	}

	return records
}

func ReadTxtFile(path string) []string {
	out := make([]string, 0)
	f, err := os.Open(path)
	if err != nil {
		panic(err)
	}

	defer f.Close()

	scaner := bufio.NewScanner(f)

	for scaner.Scan() {
		out = append(out, strings.ToLower(scaner.Text()))
	}

	return out

}
