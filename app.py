import json
import os
import pymongo
from dotenv import load_dotenv
from datetime import datetime
from flask import Flask,request,Response,render_template
from flask_restplus import Api,Resource,fields

load_dotenv("./.env")
app = Flask(__name__)
api = Api(app=app,doc="/")
mongo = api.namespace("db",description="Commits User IP To Database")

model = mongo.model('IP_INFO', 
		  {'uuid': fields.String(required = True, description="UUID"),
           'os': fields.String(required=True,description="OS"),
           'ip': fields.String(required=True,description="IP"),
           'landing': fields.String(required=True,description="URL Where User Enters Website")
          }
        )

@mongo.route("/add")
class AddUserIP(Resource):
    def __init__(self,args):
        self.mongo_url="mongodb://{}:{}@{}/{}".format(os.getenv("DB_USER"),os.getenv("DB_PASSWORD"),os.getenv("MONGO_HOST"),os.getenv("MONGO_DB"))
        self.client = pymongo.MongoClient(self.mongo_url)
        self.db = self.client.ip_db
        self.api=mongo
    @mongo.expect(model)
    def post(self,**kwargs):
        user_data = dict(request.get_json())
        user_data['timestamp'] = datetime.now().isoformat()
        self.db.user_ip.insert_one(user_data)
        resp_data = {"result":"200 OK"}
        response = Response(json.dumps(resp_data),200)
        response.headers['Content-Type'] = "application/json"
        return response

if __name__ == "__main__":
    app.run("0.0.0.0",1313)
