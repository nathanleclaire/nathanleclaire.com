var Face3 = Vector3.extend
({
	a: null, b: null, c: null,
	normal: null,
	screen: null,
	color: null,

	init: function(a, b, c, color)
	{
		this._super((a.x + b.x + c.x) / 3, (a.y + b.y + c.y) / 3, (a.z + b.z + c.z) / 3);	
	
		this.a = a;
		this.b = b;
		this.c = c;
		
		this.screen = new Vector3();

		this.color = color == null ? '#000000' : color;
	},

	toString: function()
	{
		return 'Face ( ' + this.a + ', ' + this.b + ', ' + this.c + ' )';
	}
});
