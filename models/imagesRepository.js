
 // Attention de ne pas avoir des références circulaire
 // const UsersRepository = require('./usersRepository'); pas ici sinon référence ciculaire
 const ImageFilesRepository = require('./imageFilesRepository.js');
 const UsersRepository = require('./usersRepository');
 const ImageModel = require('./image.js');
 const User = require('./user.js');
 const utilities = require("../utilities");
 const { down } = require('cli-color/move.js');
 const CollectionFilter = require("./collectionFilter.js");
 const HttpContext = require('../httpContext').get();
 
 module.exports =
    class ImagesRepository extends require('./repository') {
        constructor() {
            super(new ImageModel(), true /* cached */);
            this.setBindExtraDataMethod(this.bindImageURL);
            this.UsersRepository = new UsersRepository();
        }
        bindImageURL(image) {
            if (image) {
                let bindedImage = { ...image };
                if (image["GUID"] != "") {
                    bindedImage["OriginalURL"] = HttpContext.host + ImageFilesRepository.getImageFileURL(image["GUID"]);
                    bindedImage["ThumbnailURL"] = HttpContext.host + ImageFilesRepository.getThumbnailFileURL(image["GUID"]);
                } else {
                    bindedImage["OriginalURL"] = "";
                    bindedImage["ThumbnailURL"] = "";
                }
                if(undefined == image["Share"])
                {
                    bindedImage["Share"]=true;

                }

                bindedImage["UserId"] =image["UserId"];
                bindedImage["AvatarGUID"]="";
                if(image["UserId"]!=""){ 
                    let wtf = new UsersRepository(new User());
                    wtf.get(image["UserId"]);
                    let exist =false;
                    wtf.objectsList.forEach(element => { 
                        if(element.Id == image["UserId"]){
                            exist= true;
                            bindedImage["UserName"]="" +element.Name;
                            //bindedImage["ThumbnailURL"] = HttpContext.host + ImageFilesRepository.getThumbnailFileURL(image["GUID"]);
                            if(element.AvatarGUID!=""){ 
                                bindedImage["AvatarGUID"] =HttpContext.host + ImageFilesRepository.getThumbnailFileURL(element.AvatarGUID);
                            }
                        }
                    });
                    if(image["UserId"] && !exist){
                        return super.remove(image.Id);
                    }
                }
                if(bindedImage["AvatarGUID"]==""){
                    bindedImage["AvatarGUID"] = HttpContext.host + ImageFilesRepository.getThumbnailFileURL("No_Avatar");
                }
                if(bindedImage.Share){
                    bindedImage["ShareGUID"] =HttpContext.host + ImageFilesRepository.getThumbnailFileURL("UserShare");
                }
                return bindedImage;
            }
            return null;
        }
        getAll(params = null)
        {
            let imageList;
            let copyListImage=[];
          //  let newList= new 
          ///  {...{}};
            
             imageList = this.objects();
            if(params.keyword && params.keyword[0]!="")
            {
                    //let compteur = 0;
                    imageList.forEach(elementImage => {
                        let isWithKeyWork = true;
                        params.keyword.split(' ').forEach(element => {
                        if(!(elementImage.Description.includes(element)||elementImage.Title.includes(element)))
                        {
                            isWithKeyWork = false;
                            
                        }       
                    });
                    if(isWithKeyWork)
                     copyListImage.push(elementImage);
            }); 
            }
            else{
                copyListImage = imageList;
            }

            if (this.bindExtraDataMethod != null) {
                copyListImage = this.bindExtraData(copyListImage);
              }
              if (params) {
                let collectionFilter = new CollectionFilter(
                    copyListImage,
                  params,
                  this.model
                );
                return collectionFilter.get();
              }
              return copyListImage;
            
           
        }
        /*getAll(params = null){
            let images = super.getAll(params);
            let retain;
            if(params != null && params.keywords != null){
                let imagesRetained = [];
                let keywords = params.keywords.split(" ");
                if(keywords.lenght > 0){
                    for(let image of images){
                        let text = (image.Title + image.Description).toLowerCase();
                        retain = true;
                        for(let keyword of keywords){
                            if(text.indexOf(keyword) < 0){
                                retain = false;
                                break;
                            }
                            
                        }
                        if(retain){
                            imagesRetained.add(image);
                        }
                    }
                }
                return imagesRetained;
            }
            return images;
            
        }*/
        add(image) {
            if (this.model.valid(image)) {
                image["GUID"] = ImageFilesRepository.storeImageData("", image["ImageData"]);
                delete image["ImageData"];
                return this.bindImageURL(super.add(image));
            }
            return null;
        }
        update(image) {
            if (this.model.valid(image)) {
                image["GUID"] = ImageFilesRepository.storeImageData(image["GUID"], image["ImageData"]);
                delete image["ImageData"];
                return super.update(image);
            }
            return false;
        }
        remove(id) {
            let foundImage = super.get(id);
            if (foundImage) {
                ImageFilesRepository.removeImageFile(foundImage["GUID"]);
                return super.remove(id);
            }
            return false;
        }
    }