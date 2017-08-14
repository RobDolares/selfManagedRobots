
Twice you have worked on a directory of robots looking for jobs, once from an array of objects, and then from data stored in MongoDB.
For this project, you will take that second version and add authentication and editing.
Your project should allow for each robot -- or human user -- to log into the directory and edit their entry.
In addition, new users should be able to sign up for the directory and add their own entry.


Access db:
mongoimport --db robots --collection users --file selfManagedRobots.json
