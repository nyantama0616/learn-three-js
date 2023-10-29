var camera, scene, render, objects = [];

window.onload = function(){
    init();
    update();
}

function init(){

    var target = document.getElementById("container");
    var width = window.innerWidth;
    var height = window.innerHeight;

    //描画更新するためのもの
    render = new THREE.WebGLRenderer();
    //Retinaディスプレイに対応するためのもの
    render.setPixelRatio(window.devicePixelRatio);
    //3Dの空間のサイズを指定
    render.setSize(width, height);
    //16進数で色指定、なれないかもだけどなんか明示的に0xって書いてることが多い
    render.setClearColor(0xdddddd);
    //影をつける
    render.shadowMapEnabled = true;
    //htmlに描画
    target.appendChild(render.domElement);

    //空間を定義
    scene = new THREE.Scene();

    //環境光を作成して空間に追加
    var ambient = new THREE.AmbientLight(0xeeeeee);
    scene.add(ambient);

    //もう一つの光(今回はポイントライト)を作成して座標を設定して追加
    var light = new THREE.PointLight(0xffffff, 1, 50);
    light.position.set(0, 15, -40);
    scene.add(light);

    //カメラの作成(第二引数はアスペクト比)、位置の設定
    camera = new THREE.PerspectiveCamera(40, width/height, 1, 1000);
    camera.position.set(0, 10, 60);

    //マテリアルを作成(物体の質感とか見た目を設定するやつ)
    var material = new THREE.MeshBasicMaterial({ color: 0xff8080, emissive: 0xffffff, side: THREE.DoubleSide, flatShading: true });
    //追加
    const box0 = new MyBox(material, [-10, 10, 0]);
    scene.add(box0.mesh);
    objects.push(box0);
    
    const sushi = new MySushi(0);
    scene.add(sushi.mesh);
    objects.push(sushi);

    // リサイズ時に３D空間もリサイズする
    window.addEventListener('resize', onWindowResize, false);

}

class MyBox {
    constructor(material, position) {
        //オブジェクトを作成(骨組み)
        const cube = new THREE.BoxGeometry(10, 10, 10);
        //２つをひっつけて１つの物体にする
        this.mesh = new THREE.Mesh(cube, material);
        //位置
        this.mesh.position.set(...position);
        //傾き
        this.mesh.rotation.set(0, 0, 0);
        //大きさ(比率)
        this.mesh.scale.set(1, 1, 1);
    }

    update() {
        this.mesh.rotation.x += 0.005;
        this.mesh.rotation.y += 0.01;
    }
}

class MySushi {
    constructor(y) {
        // 画像を読み込む
        var texture = new THREE.TextureLoader().load('http://localhost:8080/images/sushi.png',
            (tex) => { // 読み込み完了時
                // 縦横比を保って適当にリサイズ
                const w = 5;
                const h = tex.image.height / (tex.image.width / w);
                console.log(tex);

                const material = new THREE.MeshBasicMaterial({ color: 0xff8080, emissive: 0xffffff, side: THREE.DoubleSide, flatShading: true, map: tex});
                this.mesh.material = material;
            });
        const cube = new THREE.BoxGeometry(10, 10, 10);
        this.mesh = new THREE.Mesh(cube);
        this.mesh.position.set(-30, y, 0);
        this.mesh.scale.set(1, 1, 1);
    }

    update() {
        if (this.mesh.position.x > 30) this.mesh.position.x = -30;
        this.mesh.position.x += 0.2;
    }
}

function onWindowResize() {
    //アスペクト比の変更
    camera.aspect = width / height;
    //カメラの内部状況の更新(新しいアスペクト比を読み込む)
    camera.updateProjectionMatrix();
    //3D空間のサイズ変更
    renderer.setSize(width, height);
}

function update(){
    //アニメーションつけるためのものupdate関数自体を引数に渡す
    requestAnimationFrame( update );
    //まわる
    objects.forEach(obj => {
        obj.update();
    });
    //今の画面を消す
    render.clear();
    //新しい画面を表示する
    render.render(scene,camera);
}
