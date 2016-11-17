# Molecular Design Applications

Predictive molecular modeling applications based on the [Molecular Design Toolkit](https://github.com/Autodesk/molecular-design-toolkit) framework. (Early development, all features are subject to change)

## Steps to run:

	git clone https://github.com/Autodesk/molecular-design-applications
	cd molecular-design-applications
	git submodule update --init --recursive
	docker build -t mdtscripts client/workflow_convert_pdb/mdtscripts
	docker-compose build
	docker-compose up

Then open your browser to  [http://localhost:4000](http://localhost:4000)

## Development

Local server and client and workflow development can be sped up by mounting local directories, see docker-compose.yml for what volume mounts to uncomment and then restatt the docker-compose command.

Testing the convert API method can be done with:

	curl --data-binary "@5e8b.pdb" http://localhost:4000/pdb_convert

(Assuming you have downloaded 5e8b.pdb from the PDB website)

### Developing frontend assets
In addition to mounting local directories as mentioned above, you can recompile the frontend assets on change by running `npm run watch` in the client directory.

## Contributing
This project is developed and maintained by the [Molecular Design Toolkit](https://github.com/autodesk/molecular-design-toolkit) project. Please see that project's [CONTRIBUTING document](https://github.com/autodesk/molecular-design-toolkit/CONTRIBUTING.md) for details.


## License

Copyright 2016 Autodesk Inc.

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.