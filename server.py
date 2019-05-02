from flask import Flask, request
from flask_cors import CORS, cross_origin
from flask_restful import Resource, Api
from json import dumps
from flask_jsonpify import jsonify
import pandas as pd 
import json
import pickle
app = Flask(__name__)
api = Api(app)

CORS(app)

df=""
fieldsname=""
# Server_Side Printing
@app.route("/")
def hello():
     str1= """<html>
     <h2>Welcome To Data Filter. Choose Your File And Start Filtering<h2>  <br>
     <pre>
     /file_name - display whole file
     /file_name/column_name - display specified column
     /file_name/column_name/var - display specified row according to var
     /file_name/column_name/&gtor&lt/var - display data according to the constraints
     <pre>
     </html>"""
     return str1
#Display whole File
@app.route("/<name>")    
def func(name):    
     global df,fieldsname
     if name.endswith('.csv'):
          df=pd.read_csv(name,delimiter=",")
          a=df.shape[1]
          fieldsname=[]
          for i in range(a): 
               fieldsname.append(df.columns[i])
          
          datatosend=[]
          data1=json.dumps(df.to_json(orient="records"))
          jsonsend=json.loads(data1)
          datatosend.append(fieldsname)
          datatosend.append(jsonsend)
          return jsonify(datatosend)
     elif name.endswith('.json'):
          with open(name) as jsonfile:
               jsondata = json.load(jsonfile)
          fieldsname=[]
          for i in jsondata[0]:
               fieldsname.append(i)
          
          datatosend=[]
          datatosend.append(fieldsname) 
          datatosend.append(jsondata)
          return jsonify(datatosend)


     return jsonify({"Error":"Found"})
#Displaying Column wise
@app.route("/<name>/<string:val>")
def function(name,val):
     func(name)
     val=val.split()
     global df,fieldsname
     
     if name.endswith('.json'):
          with open(name) as jsonfile:
             jsondata = json.load(jsonfile)  
          df=pd.DataFrame(jsondata)
     df=df[val] 
     datatosend=[]
     datatosend=[]       
     data1=json.dumps(df.to_json(orient="records"))
     jsonsend=json.loads(data1)
     
     datatosend.append(val)
     datatosend.append(jsonsend)


     return jsonify(datatosend)
#Displaying Number Of Rows
@app.route("/<name>/head/<int:num>")
def filter(name,num):
     global df
     func(name)
     if name.endswith('.json'):
          with open(name) as jsonfile:
             jsondata = json.load(jsonfile)  
          df=pd.DataFrame(jsondata)
     
     df=df.head(num)
     data1=json.dumps(df.to_json(orient="records"))
     jsonsend=json.loads(data1)
     
     
     return (jsonsend)
#Searching int Data
@app.route("/<name>/<iid>/<int:num>")
def filter1(name,iid,num):
     global df
     func(name)
     
     if name.endswith('.json'):
          with open(name) as jsonfile:
             jsondata = json.load(jsonfile)  
          df=pd.DataFrame(jsondata)
     
     df=df[df[iid]==num]
     data1=json.dumps(df.to_json(orient="records"))
     jsonsend=json.loads(data1)
     if  jsonsend == "[]":
          
          return "No User with these Values"
     
     return (jsonsend)
#searching String data
@app.route("/<name>/<iid>/<variable>")
def filter2(name,iid,variable):
     global df
     func(name)
     
     if name.endswith('.json'):
          with open(name) as jsonfile:
             jsondata = json.load(jsonfile)  
          df=pd.DataFrame(jsondata)
     
     df=df[df[iid]==variable]
     data1=json.dumps(df.to_json(orient="records"))
     
     jsonsend=json.loads(data1)
     
     if  jsonsend == "[]":
          
          return "No User with these Values"
     
     return (jsonsend)
# Greater Or Equal To Data Dsiplay
@app.route("/<name>/<iid>/<mal>/<int:variable>")
def filter3(name,iid,mal,variable):
     global df
     func(name)
     
     if name.endswith('.json'):
          with open(name) as jsonfile:
             jsondata = json.load(jsonfile)  
          df=pd.DataFrame(jsondata)
     
     if mal==">":
          df=df[df[iid]>variable]
     if mal=="<":
          df=df[df[iid]<variable]
     data1=json.dumps(df.to_json(orient="records"))
     jsonsend=json.loads(data1)
     if  jsonsend == "[]":
          
          return "No User with these Values"
     #new1=df[df[col]==val]
     
     return (jsonsend)

if __name__ == '__main__':
     app.run(port=5002)
     app.debug=True