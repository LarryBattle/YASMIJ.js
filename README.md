Project: YASMIJ.js - Yet Another Simplex Method Library for Javascript.
----------------------------------------------------------
Author: Larry Battle<br/>
Version: Beta 0.1.2
----------------------------------------------------------
The purpose of this project is to provide a simple Simplex Method library for Javascript.
The simplex method is a popular algorithm for linear programming.
It is used to solve optimization by using of artifical variables and/or branch and bound.

Example problem where the simplex method would be useful.
----------------------------------------------------------
Maximize `5x1 + 3x2 + x3`

Subject to

    5x1 + 3x2 + 6x3 = 15
    x1 + x2 + x3 = 6

where `x1`,`x2`, `x3` are all greater than or equal to 0.

Version Roadmap:
----------------------------------------------------------
* 0.1 - Complete the Equation Class (Done)
* 0.2 - Complete the Input Class (In progress)
* 0.3 - Complete the Matrix Class
* 0.4 - Complete the Tableau Class
* 0.5 - Complete the Output Class
* 0.6 - Complete the Simplex and YASMIJ Classes
* 0.7 - Get Feedback