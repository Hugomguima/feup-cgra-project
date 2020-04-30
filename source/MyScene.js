/**
 * MyScene
 * @constructor
 */
class MyScene extends CGFscene {
    constructor() {
        super();
    }
    init(application) {
        super.init(application);
        this.initCameras();
        this.initLights();
        this.initTextures();
        this.initMaterials();

        //Background color
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.setUpdatePeriod(12);

        this.enableTextures(true);

        //Initialize scene objects
        this.axis = new CGFaxis(this);
        this.cylinder = new MyCylinder(this, 8);
        this.sphere = new MySphere(this, 16, 8);
        this.cube = new MyCubeMap(this);
        this.diamond = new MyDiamond(this);
        this.vehicle = new MyVehicle(this, 10);
        this.terrain = new MyTerrain(this);
        this.billboard = new MyBillboard(this);
        

        this.appearance = new CGFappearance(this);
		this.appearance.setAmbient(0.3  , 0.3, 0.3, 1);
		this.appearance.setDiffuse(0.7, 0.7, 0.7, 1);
		this.appearance.setSpecular(0.0, 0.0, 0.0, 1);
        this.appearance.setShininess(120);
        
        this.supplies = [
            new MySupply(this),
            new MySupply(this),
            new MySupply(this),
            new MySupply(this),
            new MySupply(this),
        ];

        this.selectSupply = 0;
        this.selectedMaterial = 0;
        this.speedFactor = 1;
        this.scaleFactor = 1;

        //Objects connected to MyInterface
        this.displayAxis = true;
        this.displayCylinder = false;
        this.displaySkyBox = true;
        this.displaySphere = false;
        this.displayNormal = false;
        this.selectedTexture = 0;
        this.displayVehicle = true;

        this.timefactor = 0;

        this.audioMLP = new Audio('audio/mlp.mp3');
        this.updateAppliedTexture();

    }

    checkKeys() {
        // Check for key codes e.g. in https://keycode.info/
        if (this.gui.isKeyPressed("KeyW")) {
            this.vehicle.accelerate(0.01 * this.speedFactor);
        }
        if (this.gui.isKeyPressed("KeyS")) {
            this.vehicle.accelerate(-0.05 * this.speedFactor);
        }
        if (this.gui.isKeyPressed("KeyA")) {
            this.vehicle.turn(Math.PI / 90);
            this.vehicle.leme(0);
        }
        if (this.gui.isKeyPressed("KeyD")) {
            this.vehicle.turn(-Math.PI / 90);
            this.vehicle.leme(1);
        }
        if ((this.gui.isKeyPressed("KeyA") && this.gui.isKeyPressed("KeyD")) || (!this.gui.isKeyPressed("KeyA") && !this.gui.isKeyPressed("KeyD"))){
            this.vehicle.leme(2);
        }
        if (this.gui.isKeyPressed("KeyR")) {
            this.vehicle.reset();
            for(var i = 0; i < 5; i++){
                this.supplies[i].reset();
                this.selectSupply = 0;
            }
        }
        if (this.gui.keyPressedDown("KeyL")) {
            if(this.selectSupply < 5) {
                this.supplies[this.selectSupply].drop(this.vehicle.posX,this.vehicle.posY,this.vehicle.posZ,this.scaleFactor);
                this.selectSupply++;
            }
        }
        if (this.gui.keyPressedDown("KeyP")) {
            this.vehicle.autoPilot();
        }
    }

    // Function that initialize the scene textures
    initTextures() {
        this.worldTexture = [
            new CGFtexture(this, 'textures/skybox/world_texture/back.png'),
            new CGFtexture(this, 'textures/skybox/world_texture/bottom.png'),
            new CGFtexture(this, 'textures/skybox/world_texture/front.png'),
            new CGFtexture(this, 'textures/skybox/world_texture/left.png'),
            new CGFtexture(this, 'textures/skybox/world_texture/right.png'),
            new CGFtexture(this, 'textures/skybox/world_texture/top.png')
        ];

        this.aridTexture = [
            new CGFtexture(this, 'textures/skybox/arid/back.jpg'),
            new CGFtexture(this, 'textures/skybox/arid/bottom.jpg'),
            new CGFtexture(this, 'textures/skybox/arid/front.jpg'),
            new CGFtexture(this, 'textures/skybox/arid/left.jpg'),
            new CGFtexture(this, 'textures/skybox/arid/right.jpg'),
            new CGFtexture(this, 'textures/skybox/arid/top.jpg')
        ];

        this.divineTexture = [
            new CGFtexture(this, 'textures/skybox/divine/back.jpg'),
            new CGFtexture(this, 'textures/skybox/divine/bottom.jpg'),
            new CGFtexture(this, 'textures/skybox/divine/front.jpg'),
            new CGFtexture(this, 'textures/skybox/divine/left.jpg'),
            new CGFtexture(this, 'textures/skybox/divine/right.jpg'),
            new CGFtexture(this, 'textures/skybox/divine/top.jpg')
        ];

        this.lakeTexture = [
            new CGFtexture(this, 'textures/skybox/lake/back.jpg'),
            new CGFtexture(this, 'textures/skybox/lake/bottom.jpg'),
            new CGFtexture(this, 'textures/skybox/lake/front.jpg'),
            new CGFtexture(this, 'textures/skybox/lake/left.jpg'),
            new CGFtexture(this, 'textures/skybox/lake/right.jpg'),
            new CGFtexture(this, 'textures/skybox/lake/top.jpg')
        ];

        this.rainbowTexture = [
            new CGFtexture(this, 'textures/skybox/rainbow/back.png'),
            new CGFtexture(this, 'textures/skybox/rainbow/bottom.png'),
            new CGFtexture(this, 'textures/skybox/rainbow/front.png'),
            new CGFtexture(this, 'textures/skybox/rainbow/left.png'),
            new CGFtexture(this, 'textures/skybox/rainbow/right.png'),
            new CGFtexture(this, 'textures/skybox/rainbow/top.png')
        ];

        this.palaceTexture = [
            new CGFtexture(this, 'textures/skybox/palace/back.jpg'),
            new CGFtexture(this, 'textures/skybox/palace/bottom.jpg'),
            new CGFtexture(this, 'textures/skybox/palace/front.jpg'),
            new CGFtexture(this, 'textures/skybox/palace/left.jpg'),
            new CGFtexture(this, 'textures/skybox/palace/right.jpg'),
            new CGFtexture(this, 'textures/skybox/palace/top.jpg')
        ];


        this.textures = [this.worldTexture, this.aridTexture, this.divineTexture, this.lakeTexture, this.rainbowTexture, this.palaceTexture];
        this.textureIds = {
            'World': 0,
            'Arid': 1,
            'Divine': 2,
            'Lake': 3,
            'Rainbow': 4,
            'Palace': 5
        };
    }
    initLights() {
        this.lights[0].setPosition(15, 2, 5, 1);
        // More visibility to skybox
        this.lights[0].setAmbient(0.25, 0.25, 0.25, 1.0);
        this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
        this.lights[0].enable();
        this.lights[0].update();

        this.lights[1].setPosition(0,0,0,0);
        this.lights[1].setAmbient(0.75,0.75,0.75,0.75);
        

    }
    initCameras() {
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(50*Math.cos(Math.PI/6), 50*Math.sin(Math.PI/6), 0), vec3.fromValues(0, 0, 0));
    }
    //Function that applies a new texture selected in interface
    updateAppliedTexture() {
        this.cube.setNewTextures(this.textures[this.selectedTexture]);
        if(this.selectedTexture == 4 || this.selectedTexture == 5) {
            this.audioMLP.loop = true;
            this.audioMLP.play();
        }
        else {
            this.audioMLP.pause();
            this.audioMLP.currentTime = 0;
        }
    }
    // called periodically (as per setUpdatePeriod() in init())
    update(t) {
        this.checkKeys();
        this.vehicle.update(t);
        for(var i = 0; i < 5; i++){
            this.supplies[i].update(t);
        }
        this.billboard.update(this.selectSupply);
    }
    initMaterials() {
        this.default = new CGFappearance(this);
        this.default.setAmbient(0.2, 0.4, 0.8, 1.0);
        this.default.setDiffuse(0.2, 0.4, 0.8, 1.0);
        this.default.setSpecular(0.2, 0.4, 0.8, 1.0);
        this.default.setShininess(10.0);

        this.earth = new CGFappearance(this);
        this.earth.setAmbient(0.1, 0.1, 0.1, 1);
        this.earth.setDiffuse(0.9, 0.9, 0.9, 1);
        this.earth.setSpecular(0.1, 0.1, 0.1, 1);
        this.earth.setShininess(10.0);
        this.earth.loadTexture('textures/earth.jpg');
        this.earth.setTextureWrap('REPEAT', 'REPEAT');

        this.materials = [this.default, this.earth];

        // Labels and ID's for object selection on MyInterface
        this.materialIDs = {
            'Default': 0,
            'Earth': 1
        };
    }
    display() {
        // ---- BEGIN Background, camera and axis setup
        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();
        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        // Draw axis
        if (this.displayAxis) {
            this.axis.display();
        }

        this.materials[this.selectedMaterial].apply();

        // ---- BEGIN Primitive drawing section
        if (this.displayCylinder)
            this.cylinder.display();

        //This sphere does not have defined texture coordinates
        if (this.displaySphere)
            this.sphere.display();

        if (this.displayVehicle) {
            this.pushMatrix();
            this.translate(this.vehicle.posX,this.vehicle.posY,this.vehicle.posZ);
            this.scale(this.scaleFactor, this.scaleFactor, this.scaleFactor);
            this.translate(-this.vehicle.posX,-this.vehicle.posY,-this.vehicle.posZ);
            this.vehicle.display();
            this.popMatrix();
        }
        for(var i = 0; i < 5; i++){
            this.supplies[i].display();
        }

        if (this.displaySkyBox) {
            this.pushMatrix();
            this.translate(0,25,0);
            this.lights[1].enable();
            this.lights[1].update();
            this.scale(50, 50, 50);
            this.cube.display();
            this.lights[1].disable();
            this.lights[1].update();
            this.popMatrix();
        }

        if (this.displayNormal) {
            this.cube.enableNormalViz();
            this.vehicle.enableNormalViz();
            this.sphere.enableNormalViz();
            this.cylinder.enableNormalViz();
        } else {
            this.cube.disableNormalViz();
            this.vehicle.disableNormalViz();
            this.sphere.disableNormalViz();
            this.cylinder.disableNormalViz();
        }
        this.pushMatrix();
        this.translate(0,0,-3);
        this.rotate(Math.PI/2,0,1,0);
        this.billboard.display();
        this.popMatrix();
        this.terrain.display();
        // ---- END Primitive drawing section
    }
}
