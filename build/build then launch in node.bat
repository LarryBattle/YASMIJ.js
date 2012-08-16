set file1="C:\Users\dev\programming\js\YASMIJ.js\src\dev\NativeObjectFunctions.js"
set file2= "C:\Users\dev\programming\js\YASMIJ.js\src\dev\Expression.js"
set file3="C:\Users\dev\programming\js\YASMIJ.js\src\dev\Equation.js"
set file4="C:\Users\dev\programming\js\YASMIJ.js\src\dev\Input.js"
set file5="C:\Users\dev\programming\js\YASMIJ.js\src\dev\Matrix.js"
set file6="C:\Users\dev\programming\js\YASMIJ.js\src\dev\Tableau.js"
set file7="C:\Users\dev\programming\js\YASMIJ.js\src\dev\Output.js"
set file8="C:\Users\dev\programming\js\YASMIJ.js\src\dev\Simplex.js"
set file9="C:\Users\dev\programming\js\YASMIJ.js\src\dev\YASMIJ.js"
set output="C:\Users\dev\programming\js\YASMIJ.js\build\yasmij.js"

copy %file1% + %file2% + %file3% + %file4% + %file5% + %file6% + %file7% + %file8% + %file9% %output%

%output%
REM node yasmij.js
