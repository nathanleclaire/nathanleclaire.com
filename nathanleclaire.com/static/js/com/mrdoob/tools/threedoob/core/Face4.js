var Face4 = Vector3.extend
({
	a: null, b: null, c: null, d: null,
	normal: null,
	screen: null,
	color: null,

	init: function(a, b, c, d, color)
	{
		this._super((a.x + b.x + c.x + d.x) / 4, (a.y + b.y + c.y + d.y) / 4, (a.z + b.z + c.z + d.z) / 4);
	
		this.a = a;
		this.b = b;
		this.c = c;
		this.d = d;
		
		this.screen = new Vector3();

		this.color = color == null ? '#000000' : color;
	},

	toString: function()
	{
		return 'Face ( ' + this.a + ', ' + this.b + ', ' + this.c + ' )';
	}
});
