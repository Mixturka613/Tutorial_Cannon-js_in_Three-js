let container = document.querySelector('.container')
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js'  //links
import Stats from './stats.module.js'

let camera;
let renderer;
let scene;

function init() {

    //scene
    scene = new THREE.Scene()

    //camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000 )
    camera.position.z = 5;
    camera.position.y = 10

    //renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );
    renderer.shadowMap.enabled = true;

    //cube
    const geometry = new THREE.BoxGeometry(10, 0.01, 10);
    const material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
    let cube = new THREE.Mesh( geometry, material );
    cube.receiveShadow = true;
    scene.add( cube );

    //sphere
    const sphereGeometry = new THREE.SphereGeometry(0.5, 100, 100)
    const material2 = new THREE.MeshPhongMaterial( { color: 'blue'} );
    const sphere = new THREE.Mesh( sphereGeometry, material2 );
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    scene.add( sphere );

    //cube2
    const geometry1 = new THREE.BoxGeometry(0.6,  1 , 0.4);
    const material1 = new THREE.MeshPhongMaterial( { color: 'red' } );
    const cube1 = new THREE.Mesh( geometry1, material1 );
    cube1.castShadow = true;
    cube1.receiveShadow = true;
    scene.add( cube1 ); 

    //light
    const light = new THREE.DirectionalLight(0xFFFFFF, 1);
    light.position.set(-6, 4, 6);
    light.castShadow = true
    scene.add(light);

    const helper = new THREE.DirectionalLightHelper(light);
    scene.add(helper);

    //stats
    const stats = Stats()
    container.appendChild(stats.dom)

    //Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update(); 
    controls.enableDamping = true; 
    
    //CANNON JS
    //World
    let world = new CANNON.World() // Создаём мир
    world.gravity.set(0, -9.8, 0) // Задаём гравитацию

    // CannonDebugRenderer 
    // let CannonDebugRenderer = new THREE.CannonDebugRenderer(scene, world) //Подцветка скелетов

    //plane
    let groundBody = new CANNON.Body({
        mass: 0
    }) //Создаём тело
    let groundShape = new CANNON.Plane(0.1, 0.2) //Создаём форму
    groundBody.addShape(groundShape) //Соеденяем
    groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2) //Поворачиваем в горизонтальное положение
    world.addBody(groundBody) //Добовляем скелет в мир

    // sphere
    let sphereBody = new CANNON.Body({
        mass: 9,
        position: new CANNON.Vec3(0, 5, 0) //Позиция шара
    })
    let sphereShape = new CANNON.Sphere(0.5) // 0.5 - радиус сферы
    sphereBody.addShape(sphereShape)
    world.addBody(sphereBody)

    //cube 
    var cubeBody = new CANNON.Body({
        mass: 10,
        position: new CANNON.Vec3(0.4, 2, 0)
    })
    var cubeShape = new CANNON.Box(new CANNON.Vec3(0.3,  0.5 , 0.2)) //(new CANNON.Vec3(0.3,  0.5 , 0.2)) - размеры скелета куба
    cubeBody.addShape(cubeShape)
    world.addBody(cubeBody)

    // Плоскости - стенки
    //plane
    var planeBody = new CANNON.Body({
        mass: 0,
        position: new CANNON.Vec3(0, 0, 5) // Изменяем позицию 
    });
    var planeShape = new CANNON.Plane(0.1 ,0.2);
    planeBody.addShape(planeShape);
    planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0), Math.PI); //Поворачиваем
    world.addBody(planeBody);
    
    //plane2
    var planeBody1 = new CANNON.Body({
        mass: 0,
        position: new CANNON.Vec3(-5, 0, 0)
    });
    var planeShape1 = new CANNON.Plane(0.1 ,0.2);
    planeBody1.addShape(planeShape1);
    planeBody1.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0), Math.PI / 2);
    world.addBody(planeBody1);
    
    //plane3
    var planeBody2 = new CANNON.Body({
        mass: 0,
        position: new CANNON.Vec3(5, 0, 0)
    });
    var planeShape2 = new CANNON.Plane(0.1 ,0.2);
    planeBody2.addShape(planeShape2);
    planeBody2.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0), -Math.PI / 2);
    world.addBody(planeBody2);
    
    //plane4
    var planeBody3 = new CANNON.Body({
        mass: 0,
        position: new CANNON.Vec3(0, 0, -5)
    });
    var planeShape3 = new CANNON.Plane(0.1 ,0.2);
    planeBody3.addShape(planeShape2);
    planeBody3.quaternion.setFromAxisAngle(new CANNON.Vec3(0,0,1), -Math.PI);
    world.addBody(planeBody3);


    function animate() {
        requestAnimationFrame(animate)
        controls.update();
        stats.update()

        //Всё что связанно с cannon js
        world.step(1 / 60)
        
        //sphere
        sphere.position.z = sphereBody.position.z 
        sphere.position.y = sphereBody.position.y
        sphere.position.x = sphereBody.position.x

        sphere.quaternion.z = sphereBody.quaternion.z //Повороты
        sphere.quaternion.y = sphereBody.quaternion.y
        sphere.quaternion.x = sphereBody.quaternion.x
        sphere.quaternion.w = sphereBody.quaternion.w

        //cube
        cube1.position.z = cubeBody.position.z
        cube1.position.y = cubeBody.position.y
        cube1.position.x = cubeBody.position.x 

        cube1.quaternion.z = cubeBody.quaternion.z //Повороты
        cube1.quaternion.y = cubeBody.quaternion.y
        cube1.quaternion.x = cubeBody.quaternion.x 
        cube1.quaternion.w = cubeBody.quaternion.w

        // CannonDebugRenderer.update() // Update - CannonDebugRenderer

        //Конец всё что связанно с cannon js

        stats.begin()
        renderer.render( scene, camera );
        stats.end()
    }
    animate()
}

init()