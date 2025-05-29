# mundo
will add later
Cloud native web app 

Mundo is a fungi observation app where users can submit and browse fungi sightings.

Monorepo
Architecture: 
Static frontend hosted in an S3 bucket
(Add later: custom domain - use route 53, 1-4 a month)

AWS lambda - backend - microservices kinda
API gateway - backend API ( what kind of api: http?)
Node.js backend and react frontend
Terraform Iac

Notes:
get rid of not useful stuff like provider.tf

Frontend with react typescript on S3 bucket
							|
						API gateway to backends
					|		        |	            	|
			Lambda for posts	Lambda GET	     Lambda for s3 url
					|			    |	            	|
				DynamoDb 		DynamoDb		presigned s3 url


