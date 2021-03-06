/**
 * @author bhouston / http://exocortex.com
 */

module( "Quaternion" );

var orders = [ 'XYZ', 'YXZ', 'ZXY', 'ZYX', 'YZX', 'XZY' ];
var eulerAngles = new THREE.Vector3( 0.1, -0.3, 0.25 );



var qSub = function ( a, b ) {
	var result = new THREE.Quaternion();
	result.copy( a );

	result.x -= b.x;
	result.y -= b.y;
	result.z -= b.z;
	result.w -= b.w;

	return result;

};

test( "constructor", function() {
	var a = new THREE.Quaternion();
	ok( a.x == 0, "Passed!" );
	ok( a.y == 0, "Passed!" );
	ok( a.z == 0, "Passed!" );
	ok( a.w == 1, "Passed!" );

	a = new THREE.Quaternion( x, y, z, w );
	ok( a.x === x, "Passed!" );
	ok( a.y === y, "Passed!" );
	ok( a.z === z, "Passed!" );
	ok( a.w === w, "Passed!" );
});

test( "copy", function() {
	var a = new THREE.Quaternion( x, y, z, w );
	var b = new THREE.Quaternion().copy( a );
	ok( b.x == x, "Passed!" );
	ok( b.y == y, "Passed!" );
	ok( b.z == z, "Passed!" );
	ok( b.w == w, "Passed!" );

	// ensure that it is a true copy
	a.x = 0;
	a.y = -1;
	a.z = 0;
	a.w = -1;
	ok( b.x == x, "Passed!" );
	ok( b.y == y, "Passed!" );
});

test( "set", function() {
	var a = new THREE.Quaternion();
	ok( a.x == 0, "Passed!" );
	ok( a.y == 0, "Passed!" );
	ok( a.z == 0, "Passed!" );
	ok( a.w == 1, "Passed!" );

	a.set( x, y, z, w );
	ok( a.x == x, "Passed!" );
	ok( a.y == y, "Passed!" );
	ok( a.z === z, "Passed!" );
	ok( a.w === w, "Passed!" );
});

test( "setFromAxisAngle", function() {

	// TODO: find cases to validate.
	ok( true, "Passed!" );

	var zero = new THREE.Quaternion();

	var a = new THREE.Quaternion().setFromAxisAngle( new THREE.Vector3( 1, 0, 0 ), 0 );
	ok( a.equals( zero ), "Passed!" );
	a = new THREE.Quaternion().setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), 0 );
	ok( a.equals( zero ), "Passed!" );
	a = new THREE.Quaternion().setFromAxisAngle( new THREE.Vector3( 0, 0, 1 ), 0 );
	ok( a.equals( zero ), "Passed!" );

	var b1 = new THREE.Quaternion().setFromAxisAngle( new THREE.Vector3( 1, 0, 0 ), Math.PI );
	ok( ! a.equals( b1 ), "Passed!" );
	var b2 = new THREE.Quaternion().setFromAxisAngle( new THREE.Vector3( 1, 0, 0 ), -Math.PI );
	ok( ! a.equals( b2 ), "Passed!" );

	b1.multiplySelf( b2 );
	ok( a.equals( b1 ), "Passed!" );
});


test( "setFromEuler/setEulerFromQuaternion", function() {

	var angles = [ new THREE.Vector3( 1, 0, 0 ), new THREE.Vector3( 0, 1, 0 ), new THREE.Vector3( 0, 0, 1 ) ];

	// ensure euler conversion to/from Quaternion matches.
	for( var i = 0; i < orders.length; i ++ ) {
		for( var j = 0; j < angles.length; j ++ ) {
			var eulers2 = new THREE.Vector3().setEulerFromQuaternion( new THREE.Quaternion().setFromEuler( angles[j], orders[i] ), orders[i] );
		
			ok( eulers2.distanceTo( angles[j] ) < 0.001, "Passed!" );
		}
	}

});

test( "setFromEuler/setFromRotationMatrix", function() {

	// ensure euler conversion for Quaternion matches that of Matrix4
	for( var i = 0; i < orders.length; i ++ ) {
		var q = new THREE.Quaternion().setFromEuler( eulerAngles, orders[i] );
		var m = new THREE.Matrix4().setRotationFromEuler( eulerAngles, orders[i] );
		var q2 = new THREE.Quaternion().setFromRotationMatrix( m );

		ok( qSub( q, q2 ).length() < 0.001, "Passed!" );
	}

});

test( "normalize/length/lengthSq", function() {
	var a = new THREE.Quaternion( x, y, z, w );
	var b = new THREE.Quaternion( -x, -y, -z, -w );

	ok( a.length() != 1, "Passed!");
	ok( a.lengthSq() != 1, "Passed!");
	a.normalize();
	ok( a.length() == 1, "Passed!");
	ok( a.lengthSq() == 1, "Passed!");

	a.set( 0, 0, 0, 0 );
	ok( a.lengthSq() == 0, "Passed!");
	ok( a.length() == 0, "Passed!");
	a.normalize();
	ok( a.lengthSq() == 1, "Passed!");
	ok( a.length() == 1, "Passed!");
});

test( "inverse/conjugate", function() {
	var a = new THREE.Quaternion( x, y, z, w );

	// TODO: add better validation here.

	var b = a.clone().conjugate();

	ok( a.x == -b.x, "Passed!" );
	ok( a.y == -b.y, "Passed!" );
	ok( a.z == -b.z, "Passed!" );
	ok( a.w == b.w, "Passed!" );
});


test( "multiply/multiplySelf", function() {
	
	var angles = [ new THREE.Vector3( 1, 0, 0 ), new THREE.Vector3( 0, 1, 0 ), new THREE.Vector3( 0, 0, 1 ) ];

	var q1 = new THREE.Quaternion().setFromEuler( angles[0], "XYZ" );
	var q2 = new THREE.Quaternion().setFromEuler( angles[1], "XYZ" );
	var q3 = new THREE.Quaternion().setFromEuler( angles[2], "XYZ" );

	var q = new THREE.Quaternion().multiply( q1, q2 ).multiplySelf( q3 );

	var m1 = new THREE.Matrix4().setRotationFromEuler( angles[0], "XYZ" );
	var m2 = new THREE.Matrix4().setRotationFromEuler( angles[1], "XYZ" );
	var m3 = new THREE.Matrix4().setRotationFromEuler( angles[2], "XYZ" );

	var m = new THREE.Matrix4().multiply( m1, m2 ).multiplySelf( m3 );

	var qFromM = new THREE.Quaternion().setFromRotationMatrix( m );

	ok( qSub( q, qFromM ).length() < 0.001, "Passed!" );
});

test( "multiplyVector3", function() {
	
	var angles = [ new THREE.Vector3( 1, 0, 0 ), new THREE.Vector3( 0, 1, 0 ), new THREE.Vector3( 0, 0, 1 ) ];

	// ensure euler conversion for Quaternion matches that of Matrix4
	for( var i = 0; i < orders.length; i ++ ) {
		for( var j = 0; j < angles.length; j ++ ) {
			var q = new THREE.Quaternion().setFromEuler( angles[j], orders[i] );
			var m = new THREE.Matrix4().setRotationFromEuler( angles[j], orders[i] );

			var v0 = new THREE.Vector3(1, 0, 0);
			var qv = q.multiplyVector3( v0.clone() );
			var mv = m.multiplyVector3( v0.clone() );
		
			ok( qv.distanceTo( mv ) < 0.001, "Passed!" );
		}
	}

});

test( "equals", function() {
	var a = new THREE.Quaternion( x, y, z, w );
	var b = new THREE.Quaternion( -x, -y, -z, -w );
	
	ok( a.x != b.x, "Passed!" );
	ok( a.y != b.y, "Passed!" );

	ok( ! a.equals( b ), "Passed!" );
	ok( ! b.equals( a ), "Passed!" );

	a.copy( b );
	ok( a.x == b.x, "Passed!" );
	ok( a.y == b.y, "Passed!" );

	ok( a.equals( b ), "Passed!" );
	ok( b.equals( a ), "Passed!" );
});
