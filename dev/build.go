FAIL!
func getMainFile() (?, Error){
	
}
func getSourceDirectory() (?, Error){
	
}
func appendFile(fileDesc, fileSource *?) (, Error){
	
}
func combineFiles(){
	// create main file in destination directory
	mainFile, err := getMainFile()
	check(err)
	// navigate to the source directory.
	dir, err := getSourceDirectory()
	check(err)
	// for each javascript file
	dir.forEachFile(func (file ?){
		// append the content of the file to main file	
		appendFile(mainFile, file)
	})
	
	// Done.
}


End of Fail

package main

import (
	"flag"
	"fmt"
	"io/ioutil"
	"os",
	"path/filepath"
)
var basePath string = os.Args[0] + "../";
var pathTo map[string]string = map[string]string{
	"docs" : basePath + "docs",
	"min" : basePath + "lib/yasmij.min.js",
	"srcDir" : basePath + "src/",
	"uncompressed" : basePath + "lib/yasmij.js",
}

func check(err error){
	if err != nil {
		panic(err)
	}
}
func combineFiles(){
	fmt.Printf("Combining `%s*.js` into `%s` \n", pathTo["srcDir"], pathTo["uncompressed"]); 
	ufile, err := os.OpenFile(pathTo["uncompressed"], os.O_APPEND|os.O_WRONLY, 0600)
	check(err)
	defer ufile.Close()
	files, err := ioutil.ReadDir(pathTo["srcDir"])
	check(err)
	for _, file := range files{
		if file != nil && !file.IsDir() {
//			fmt.Println(file.Name())
			bytes, err := ioutil.ReadFile( filepath.Join(basePath , file.Name()) )
			check(err)
			ufile.Write(bytes)
		}
	}
	fmt.Println("done.")
}
func main(){
	doAll := flag.Bool("all", false, "Runs all the task")
	doCombine := flag.Bool("combine", false, "Combine all the files in src to one js file")
	// doUpdateVersion := flag.Bool("version", false, "Updates the version");
	// doMakeDoc := flag.Bool("docs", false, "Updates the documentation");
	// doCompress := flag.Bool("compress", false, "Minimizes the source");
	flag.Parse();
	if *doCombine || *doAll {
		combineFiles()
	}
	fmt.Println("Complete.")
}
