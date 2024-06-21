export default class StateMachine
{
	idle = true;
	ast = Object.create( null );

	name( name )
	{
		this.idle = false;
		this.ast.name = name;

		return this;
	}

	starts( index )
	{
		this.idle = false;
		this.ast.start = index;

		return this;
	}

	ends( index )
	{
		this.idle = false;
		this.ast.end = index;

		return this;
	}

	set( name, value )
	{
		this.idle = false;
		this.ast[ name ] = value;

		return this;
	}

	flush()
	{
		const { ast } = this;

		this.idle = true;
		this.ast = Object.create( null );

		return ast;
	}
}
