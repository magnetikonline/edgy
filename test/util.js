'use strict';

class TestCaseRunner {
	constructor() {
		this._testCaseList = [];
	}

	add(testCase) {
		this._testCaseList.push(testCase);
	}

	async execute() {
		for (const testCase of this._testCaseList) {
			try {
				await testCase();
			} catch (ex) {
				console.error(ex);
				return;
			}
		}
	}
}


module.exports = {
	TestCaseRunner,
};
