import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';




@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'dataFilter';
  constructor(private httpClient: HttpClient) {

  }
  textt; errorype = ""; errorType = ""; groupflag = false; numflag = false; addflag = true; idflag = false; Bycol = false; Bycons = false; csvjson: boolean = false; val; fieldsfilter; flagt = false; bflag = false; fname; ftype = ".csv"; serverData; ss; fields; dataj; fieldssend: string[]; list = "";; list1 = [];; c = [];; checkboxc
  // ngIf for Filter By Constraints
  sss(s) {
    if (s == 101) {
      this.groupflag = false
      this.numflag = true
      this.idflag = false
    }
    else if (s == 102) {
      this.groupflag = false
      this.numflag = false
      this.idflag = true
    }
    else if (s == 103) {
      this.numflag = false
      this.idflag = false
      this.groupflag = true
    }

  }
  // File Input Empty Or Not
  bool() {
    this.bflag = false
    this.errorype = ""
  }
  // Checking Column in in database Or Not
  CheckCol(col) {
    let co = 0;

    col = col.trim()
    for (let i = 0; i < this.fields.length; i++) {

      if (col === this.fields[i])
        co = co + 1

    }
    if (co == 0) {
      this.errorType = "Column Not Found"
    }
    else {
      this.errorType = ""
    }
// Data Constraints Greater Than Or Less Than
  }
  groupconstraints(col, mal, val) {
    col = col.trim()
    this.httpClient.get('http://127.0.0.1:5002/' + this.fname + "/" + col + '/' + mal + '/' + val)
      .subscribe((data => {
      this.serverData = data
        this.errorType = ""
      }), (error => {
        this.errorType = "Data Not Valid"
      }))
  }
  // Number oF Rows
  constraints(se) {


    this.httpClient.get('http://127.0.0.1:5002/' + this.fname + "/" + 'head/' + se)
      .subscribe(data => {
      this.serverData = data
        this.errorType = ""
      }, (error => {
        this.errorType = "Data Not asValid"
      }))

// Searching Data
  }
  idconstraints(col, se) {

    col = col.trim()
    this.httpClient.get('http://127.0.0.1:5002/' + this.fname + "/" + col + '/' + se)
      .subscribe(data => {
      this.serverData = data
        this.errorType = ""
      }, (error => {
        this.errorType = "Data Not Found"
      }))

  }
  ByColumn() {
    this.errorType = ""
    this.errorype = ""
    this.numflag = false
    this.idflag = false
    this.Bycol = true;
    this.Bycons = false
    this.checkboxc = false
    for (let i = 0; i < this.fields.length; i++) {
      this.c[i] = 0;
      this.list1[i] = "";
    }
  }
  ByConstraints() {
    //this.addflag=true
    this.errorType = ""
    this.errorype = ""
    this.Bycol = false;
    this.Bycons = true

  }
  setCsv() {
    this.ftype = ".csv"
  }
  i = 0;


  check(a, f) {
    this.c[a] = this.c[a] + 1;
    this.list1[a] = f;
    console.log(this.c);

  }
  fcheck() {
    this.list = ""
    for (let i in this.c) {
      if (this.c[i] % 2 != 0) {
        this.list = this.list + " " + this.list1[i]
        console.log(this.list)
      }

    }
    console.log(this.list)
  }

  setJson() {
    this.ftype = ".json"
  }
  filename(name) {

    if (name == "") {

      this.errorype = "Please Choose a File"
    }
    else {
    this.bflag = true
      this.errorType = ""
      let neww = name.split('\\')
      this.fname = neww[2]
      console.log(name)
      console.log(this.fname)

    }
  }
// Filtering data using Column names
  filter(name) {
    this.fcheck()
    if (this.list.trim() == "") {

      this.errorType = "No Column Selected"
    }
    else {
      this.errorType = ""
      this.flagt = false
      this.filename(name)
      this.list = this.list.trim()
      this.val = this.list.split(" ")
      this.httpClient.get('http://127.0.0.1:5002/' + this.fname + "/" + this.list).subscribe(data => {
        this.serverData = data
        this.csvjson = true
        this.fieldsfilter = this.serverData[0]
        console.log(this.fieldsfilter)
        this.serverData = JSON.parse(this.serverData[1])
      })
    }

  }
  // Whole data Display
  filewise(name) {
    this.Bycol = false;
    this.fcheck()
    this.filename(name)

    this.flagt = true

    this.httpClient.get('http://127.0.0.1:5002/' + this.fname).subscribe(data => {

      this.serverData = data
      if (this.ftype == ".csv") {

        this.fields = this.serverData[0]
        console.log(this.fields)
        this.serverData = JSON.parse(this.serverData[1])
      }
      if (this.ftype == ".json") {
        this.fields = (this.serverData[0])
        console.log(this.fields)
        this.serverData = this.serverData[1]
      }
    })

  }
}