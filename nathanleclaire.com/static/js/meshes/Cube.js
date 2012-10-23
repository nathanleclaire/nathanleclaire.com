var Cube = Geometry.extend
({
	init: function()
	{
		this._super();

		this.v(1,-1,-1);
		this.v(1,-1,1);
		this.v(-1,-1,1);
		this.v(-1,-1,-1);
		this.v(1,1,-1);
		this.v(1,1,1);
		this.v(-1,1,1);
		this.v(-1,1,-1);

		this.f4(0,1,2,3);
		this.f4(4,7,6,5);
		this.f4(0,4,5,1);
		this.f4(1,5,6,2);
		this.f4(2,6,7,3);
		this.f4(4,0,3,7);
	},

	v: function( x, y, z )
	{
		this.vertices.push( new Vertex( x, y, z ) );
	},

	f3: function( a, b, c )
	{
		this.faces.push( new Face3( this.vertices[a], this.vertices[b], this.vertices[c] ) );
	},

	f4: function( a, b, c, d )
	{
		this.faces.push( new Face4( this.vertices[a], this.vertices[b], this.vertices[c], this.vertices[d] ) );
	}
});
