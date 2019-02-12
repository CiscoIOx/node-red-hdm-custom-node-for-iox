# node-red-hdm-custom-node-for-iox

This repo contains code for Cisco IOx HDM custom node module of Node-RED. HDM stands for Host Device Management. The HDM custom node is a function that outputs real-time on-demand HDM data of IR800. The output includes the results of any show commands of the device.

## Requirements before use

- Docker deamon up and running.
- Cisco IR800 device.
- IOxCore 1.5.0, IOxGPS 1.5.1, IOxMotion 1.5.1 and IOxHdm 1.0 services running on the device.

**(If you don't want GPS service or motion service, you need to remove the dependencies in `package.yaml` and modify the base image in Dockerfile to `node0:1.0`.)**

- ioxclient installed.

## Steps to use HDM custom node

**0.1 Build Node-RED slim Docker image**

(If you already have Docker image `node0:1.0`, you can skip this step.)

Build Docker image `node0:1.0` using the following package:
https://github.com/CiscoIOx/node-red-slim-for-iox

**0.2 Build gps node Docker image**

(If you already have Docker image `gpsnode:1.0`, you can skip this step.)

Build Docker image `gpsnode:1.0` using the following package:
https://github.com/CiscoIOx/node-red-gps-node-for-iox

**0.3 Build motion node Docker image**

(If you already have Docker image `motionnode:1.0`, you can skip this step.)

Build Docker image `motionnode:1.0` using the following package:
https://github.com/CiscoIOx/node-red-motion-node-for-iox

**0.4 Build HDM node Docker image**

(If you already have Docker image `hdmnode:1.0`, you can skip this step.)

Build Docker image `hdmnode:1.0` using the following package:
https://github.com/CiscoIOx/node-red-hdm-node-for-iox

**1. Build HDM custom node Docker image**

Go to the root of this package (same path as Dockerfile) and run:
`docker build -t hdmcustomnode:1.0 .`

Don't forget the `.` at the end. It means the current directory.
This will create a Docker image `hdmcustomnode:1.0` based on the previously built image `hdmnode:1.0`.

**2. Create IOx application package**

Use the following command to build the IOx application package named **package.tar**.

`ioxclient docker package hdmcustomnode:1.0 .`

Don't forget the `.` at the end.

**3. Deploy, activate and start the app**

Deploy the application onto IR800 using Local Manager or ioxclient.

**For Local Manager option:**

Access device Local Manager UI using the URL path **https://:8443**.

Deploy the app using the name `nodered` and the package `package.tar` that you created.

![image](https://user-images.githubusercontent.com/47573639/52669802-ec58eb80-2ecb-11e9-98ac-655385899b88.png)

![image](https://user-images.githubusercontent.com/47573639/52669839-0692c980-2ecc-11e9-8e75-940cd17bec35.png)

Activate the app with these configurations:
- Choose `iox-nat0` for network and `1880:1880` for custom port mapping.
- Choose `async1` and `async0` for device serial ports.
- The recommended resource profile is:
  - CPU: 200 cpu-units
  - Memory: 128 MB
  - Disk: 10 MB

  You can change the combination upon the consumption of your other apps. The memory should be no less.

![image](https://user-images.githubusercontent.com/47573639/52669886-21653e00-2ecc-11e9-9a46-a0d7893ebd6c.png)

![image](https://user-images.githubusercontent.com/47573639/52669905-33df7780-2ecc-11e9-9e87-2034a9c277c3.png)

![image](https://user-images.githubusercontent.com/47573639/52669953-478ade00-2ecc-11e9-8b28-372632210bfc.png)

Finally start the app.

![image](https://user-images.githubusercontent.com/47573639/52670022-730dc880-2ecc-11e9-9e7d-596e5a8aed68.png)

**For ioxclient option:**

Run the following command to deploy, activate and start the app:

`ioxclient app install nodered package.tar`

`ioxclient app activate --payload activation.json nodered`

`ioxclient app start nodered`

The `activation.json` file is similar to the Sample Activation payload in [GPS service introduction of IOx](https://developer.cisco.com/docs/iox/#!how-to-install-gps-service/how-to-install-gps-service).

**4. Verify the app is running**

Open Node-RED interface at **http://:1880**.

![image](https://user-images.githubusercontent.com/47573639/52670134-ad776580-2ecc-11e9-8cdc-ee5e62316ee2.png)

Build a simple flow with `inject`, `Hdm custom IOx connector` and `debug` nodes. Use `timestamp` as the payload of `inject` node.

![image](https://user-images.githubusercontent.com/47573639/52672273-3a70ed80-2ed2-11e9-949d-a8b97e2ad7b4.png)

Set `Repeat` to `none`.

![image](https://user-images.githubusercontent.com/47573639/52672290-4b216380-2ed2-11e9-8b95-ffc8313a6092.png)

Double click the `hdm_custom` node and type in a show command (any command built for IOS console) and deploy.

![image](https://user-images.githubusercontent.com/47573639/52672324-64c2ab00-2ed2-11e9-9e2a-2689879673ba.png)

![image](https://user-images.githubusercontent.com/47573639/52672348-73a95d80-2ed2-11e9-8cbf-50e777c857bc.png)

Click the button at `timestamp` node once. You'll be able to see a result of the show command you assigned.

![image](https://user-images.githubusercontent.com/47573639/52672382-8f146880-2ed2-11e9-9b65-b93aac22334b.png)

If you set `Repeat` to `interval` of `every 20 seconds` and deploy. (Some results of show commands are long and too frequent requests may break the HDM service, so longer intervals are recommended.)

![image](https://user-images.githubusercontent.com/47573639/52672406-9fc4de80-2ed2-11e9-9ef5-01c092805097.png)

![image](https://user-images.githubusercontent.com/47573639/52672421-ad7a6400-2ed2-11e9-8ac2-ac44384edce7.png)

![image](https://user-images.githubusercontent.com/47573639/52672440-b9febc80-2ed2-11e9-9eb5-454f6d937913.png)

Set `Repeat` back to `none` and deploy to stop data streaming.

**5. Export flows**

Enter IOx appconsole by:

`ioxclient app console nodered`

![image](https://user-images.githubusercontent.com/47573639/52670461-6e95df80-2ecd-11e9-89dc-2605bb189b47.png)

Run the following command to push flows file and credentials file to Local Manager.

`sh /usr/src/node-red/hdmcustom/getflows.sh`

![image](https://user-images.githubusercontent.com/47573639/52672476-d3a00400-2ed2-11e9-8a0a-cb6cb8832e32.png)

Go to Local Manager. Click `Manage` of the nodered app. Click `App-DataDir` tab, you'll see the `flows_$(hostname).json` and `flows_$(hostname)_cred.json` files from there. Download the files to get the flows in Node-RED of this device. The credentials are encrypted.

![image](https://user-images.githubusercontent.com/47573639/52670527-a6048c00-2ecd-11e9-8654-7d1b47515fb9.png)

**6. Use the flows on other devices**

Go to the Local Manager of a different device. Or you can use Fog Director for multiple devices.

Upload `flows_$(hostname).json` and `flows_$(hostname)_cred.json` under `App-DataDir` tab. These two files should both be uploaded or not. They work in a pair. Use path `flows.json` and `flowscred.json` respectively to ensure that they will work on different types of devices.

![image](https://user-images.githubusercontent.com/47573639/52670554-b61c6b80-2ecd-11e9-82f0-b95756111426.png)

![image](https://user-images.githubusercontent.com/47573639/52670584-c9c7d200-2ecd-11e9-9248-f7975a79d684.png)

Start the nodered app of this second device. You should be able to see the flows with credentials already set up.

![image](https://user-images.githubusercontent.com/47573639/52670612-dc420b80-2ecd-11e9-91ba-a8438398db41.png)

Example flows are shown below.

![image](https://user-images.githubusercontent.com/47573639/52672088-9b4bf600-2ed1-11e9-8ce6-802a29665c9b.png)

**7. Set up your own credentialSecret**

By default, the `credentialSecret` in `settings.js` of the nodered app is set to `cisco`. If you want to use your own `credentailSecret`, create a file called `cred.json` and upload with path `cred.json` before you start the app in IOx:

```
{
	"credentialSecret": "your own credentialSecret"

}
```

![image](https://user-images.githubusercontent.com/47573639/52670692-0abfe680-2ece-11e9-8edc-9123ede79bbd.png)

Make sure you have this `cred.json` file with the same `credentialSecret` for all your devices so that the `flows_$(hostname)_cred.json` file can be decrypted correctly.

Note that once you set `credentialSecret` you cannot change its value.