# occ-media-migrator for [Oracle Commerce Cloud](https://cloud.oracle.com/en_US/commerce-cloud "Oracle Commerce Cloud")
Tool to download all images from source OCC instance, optimize, package, and deploy media to multiple targeted OCC instances

### * Max file size per zip in 1GB   


#### Version v1.1.0   

## Changelog   
v1.0.0
- image download from source
- image zip 
- image transfer to target servers

## Installation
```$xslt
npm i -g
```

## Instructions   

```
Usage: omm -s [sourceserver] -t [keys] -d [imagePath] -u [uploadtype]

Tool to transfer images across mutiple OCC instances

Options:
  -V, --version                            output the version number
  -s, --sourceserver <sourceserver>        Source server where images will be downloaded from
  -t, --sourceserverkey <sourceserverkey>  Source server key
  -u, --targetservers <items>              Comma delimited string with the server definitions ie: server1,server2,serverN
  -v, --targetserverkeys <items>           Occ Admin api key for server ie: [server key source],[server key target]
  -w, --imagepath <imagepath>              path to folder to generate the image zipfile
  -x, --imagetype <imagetype>              Upload Type < general, collections, product >
  -y, --optimize <n>                       optimizes images before packaging, (0 - 1)
  -h, --help                               output usage information  
```

#### Example

```$xslt
omm  --sourceserver {SOURCE_SERVER} 
     --sourceserver {SOURCE_SERVER_KEY} 
     --targetservers {TARGET_SERVER1,TARGET_SERVER2}
     --targetserverkeys {TARGET_SERVER1_KEY,TARGET_SERVER2_KEY}  
     --imagepath {FOLDER} 
     --imagetype [general | collections | products]
```
## Related   
 [occ-media-uploader](https://github.com/leedium/occ-media-uploader "occ-media-uploader") .  
 [occ-instance-migrator](https://github.com/leedium/occ-instance-migrator "occ-instance-migrator")   


<br/><br/><br/>
### Disclaimer of Warranty.

  THERE IS NO WARRANTY FOR THE PROGRAM, TO THE EXTENT PERMITTED BY
APPLICABLE LAW.  EXCEPT WHEN OTHERWISE STATED IN WRITING THE COPYRIGHT
HOLDERS AND/OR OTHER PARTIES PROVIDE THE PROGRAM "AS IS" WITHOUT WARRANTY
OF ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING, BUT NOT LIMITED TO,
THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
PURPOSE.  THE ENTIRE RISK AS TO THE QUALITY AND PERFORMANCE OF THE PROGRAM
IS WITH YOU.  SHOULD THE PROGRAM PROVE DEFECTIVE, YOU ASSUME THE COST OF
ALL NECESSARY SERVICING, REPAIR OR CORRECTION.
