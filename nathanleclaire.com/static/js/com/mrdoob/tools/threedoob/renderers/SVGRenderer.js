var SVGRenderer = Class.extend
({
	matrix: null,
	svg: null,

	init: function()
	{
		this.matrix = new Matrix4x4();

		this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
		this.svg.style.position = "absolute";
	},

	setSize: function( width, height )
	{
		this.svg.setAttribute('viewBox', (-width / 2) + ' ' + (-height / 2) + ' ' + width + ' ' + height );
		this.svg.setAttribute('width', width);
		this.svg.setAttribute('height', height);
	},

	render: function( scene, camera )
	{
		var m, v, f;
		var focuszoom = camera.focus * camera.zoom;

		while (this.svg.childNodes.length > 0)
		{
			this.svg.removeChild(this.svg.childNodes[0]);
		}

		for (var i = 0; i < scene.objects.length; i++)
		{
			m = scene.objects[i];
			m.screen.copy(m.position);

			this.matrix.multiply( camera.matrix, m.matrix );
			this.matrix.transform( m.screen );
		}

		scene.objects.sort(function(a, b){ return b.screen.z - a.screen.z; });

		for (var i = 0; i < scene.objects.length; i++)
		{
			if (scene.objects[i] instanceof Mesh)
			{
				m = scene.objects[i];

				this.matrix.multiply( camera.matrix, m.matrix );

				// vertices

				for (var j = 0; j < m.geometry.vertices.length; j++)
				{
					v = m.geometry.vertices[j];

					v.screen.copy(v);
					this.matrix.transform(v.screen);

					v.visible = ( camera.focus + v.screen.z ) > 0;
					
					v.screen.multiply( focuszoom / (camera.focus + v.screen.z) );
				}

				// faces

				var renderList = new Array();

				for (j = 0; j < m.geometry.faces.length; j++)
				{
					f = m.geometry.faces[j];
					
					if (f instanceof Face3)
					{
						if (f.a.visible && f.b.visible && f.c.visible &&
						   (f.c.screen.x - f.a.screen.x) * (f.b.screen.y - f.a.screen.y) -
						   (f.c.screen.y - f.a.screen.y) * (f.b.screen.x - f.a.screen.x) > 0)
						{
							f.screen.z = Math.max(f.a.screen.z, Math.max(f.b.screen.z, f.c.screen.z));
							renderList.push( f );
						}
					}
					else if (f instanceof Face4)
					{
						if (f.a.visible && f.b.visible && f.c.visible &&
						   ((f.d.screen.x - f.a.screen.x) * (f.b.screen.y - f.a.screen.y) -
						   (f.d.screen.y - f.a.screen.y) * (f.b.screen.x - f.a.screen.x) > 0 ||
						   (f.b.screen.x - f.c.screen.x) * (f.d.screen.y - f.c.screen.y) -
						   (f.b.screen.y - f.c.screen.y) * (f.d.screen.x - f.c.screen.x) > 0))
						{
							f.screen.z = Math.max(f.a.screen.z, Math.max(f.b.screen.z, f.c.screen.z));
							renderList.push( f );
						}						
					}
				}

				renderList.sort(function(a, b){ return b.screen.z - a.screen.z; });
				
				for (j = 0; j < renderList.length; j++)
				{
					f = renderList[j];

					if (f instanceof Face3)
					{

						var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
						path.setAttribute('d', 'M ' + f.a.screen.x + ' ' + f.a.screen.y + ' L ' + f.b.screen.x + ' ' + f.b.screen.y + ' L ' + f.c.screen.x + ',' + f.c.screen.y + 'z');					
						path.setAttribute('fill', f.color);
						// path.setAttribute('fill-opacity', 0.5);
						// path.setAttribute('stroke', f.color);
						// path.setAttribute('stroke-width', 2);
						path.setAttribute('shape-rendering', 'crispEdges');
						// path.setAttribute('pointer-events', 'none');
						this.svg.appendChild(path);
					}
					else if (f instanceof Face4)
					{
						var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
						path.setAttribute('d', 'M ' + f.a.screen.x + ' ' + f.a.screen.y + ' L ' + f.b.screen.x + ' ' + f.b.screen.y + ' L ' + f.c.screen.x + ',' + f.c.screen.y + ' L ' + f.d.screen.x + ',' + f.d.screen.y + 'z');
						path.setAttribute('fill', f.color);
						// path.setAttribute('fill-opacity', 0.5);
						// path.setAttribute('stroke', f.color);
						// path.setAttribute('stroke-width', 2);
						path.setAttribute('shape-rendering', 'crispEdges');
						// path.setAttribute('pointer-events', 'none');
						this.svg.appendChild(path);						
					}
				}

			}
		}
	}
});
