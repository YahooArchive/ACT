// Fake sDarla API
window.Y = {
	SandBox: {
		vendor: {
			register: sinon.stub(),
			expand: sinon.stub(),
			collapse: sinon.stub(),
			resizeTo: sinon.stub(),
			geom: sinon.stub()
		}
	}
}
