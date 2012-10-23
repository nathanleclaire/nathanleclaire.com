var Mesh = Class.extend
({
	geometry: null,
	material: null,

	position: null,
	rotation: null,
	scale: null,

	screen: null,

	matrix: null,

	init: function( geometry )
	{
		this.geometry = geometry;

		this.position = new Vector3(0, 0, 0);
		this.rotation = new Vector3(0, 0, 0);
		this.scale = new Vector3(1, 1, 1);

		this.screen = new Vector3(0, 0, 0);

		this.matrix = new Matrix4x4();
	},

	updateMatrix: function()
	{
		this.matrix.identity();
		this.matrix.multiplySelf( Matrix4x4.translationMatrix( this.position.x, this.position.y, this.position.z) );
		this.matrix.multiplySelf( Matrix4x4.rotationMatrix( this.rotation.x, this.rotation.y, this.rotation.z ) );		
		this.matrix.multiplySelf( Matrix4x4.scaleMatrix( this.scale.x, this.scale.y, this.scale.z ) );	}
});
