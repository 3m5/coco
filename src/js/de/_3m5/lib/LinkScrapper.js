var Coco = require("3m5-coco"),
    $    = require("jequery");
/**
 * Class: LinkScrapper
 *
 * extends <Coco.Event>
 *
 * Description:
 *
 * (c) 2016 3m5. Media GmbH
 */
module.exports = dejavu.Class.declare({
	//className
	$name:    "LinkScrapper",
	//inheritance
	$extends: Coco.EventDispatcher,

  imgArrayCounter: null,
  tid: null,
  scrapeCache: null,
  urlActive: null,

  initialize: function () {
    this.imgArrayCounter = 0;
    this.scrapeCache = {};
  },

  /**
   * Function: scrapeURL
   *
   * scrapes given url
   *
   * Parameter:
   * @param urlText : String - url to scrape, stores scraped data on 'data' object, accepts urls starting with: http://, https://, www.
   *
   * @param callbackData : Function - callback after url was scraped successfully
   *
   * @param callbackImages : Function - callback after all images in scraped page were identified successfully
   */
  scrapeURL: function (urlText, callbackData, callbackImages) {
    var urlString;

    if (urlText.indexOf('http://') >= 0) {
      urlString = this.getUrl('http://', urlText);
    }
    else if (urlText.indexOf('https://') >= 0) {
      urlString = this.getUrl('https://', urlText);
    }
    else if (urlText.indexOf('www.') >= 0) {
      urlString = "http://" + this.getUrl('www.', urlText);
    }
    else {
      console.warn("LinkScrapper.scrapeULR - CANCELED: no url to scrape! " + urlText);

      return;
    }

    if (this.urlActive == null) {
      this.urlActive = urlString;
      this.__getUrlData(this.urlActive, callbackData, callbackImages);
    } else {
      //wait for finishing current scrape process
      setTimeout(() => {
        this.scrapeURL(urlText, callbackData, callbackImages);
      }, 500);
    }
  },

  /**
   * cancel timer for loading data
   */
  __abortTimer: function () {
    if (null != this.tid) clearTimeout(this.tid)
  },

  /**
   * Function: getUrl
   *
   * Description:
   * gets url from given text
   *
   * Parameter:
   * @param {string} prefix - URL prefix, url has to starts with it
   *
   * @param {string}urlText - text to find url inside
   *
   * Return:
   * @returns {string} - found url
   */
  getUrl: function (prefix, urlText) {
    var urlString = '';
    var startIndex = urlText.indexOf(prefix);

    for (var i = startIndex; i < urlText.length; i++) {
      if (urlText[i] == ' ' || urlText[i] == '\n') {
        break;
      }
      else {
        urlString += urlText[i];
      }
    }

    return urlString
  },

  /**
   * @param urlString
   * @param callbackData
   * @param callbackImages
   */
  __getUrlData: function (urlString, callbackData, callbackImages) {
    console.log("LinkScrapper.getUrlData " + urlString + " ?");

    //do not scrape same url twice
    var data = this.scrapeCache[urlString];
    if (data != null) {
      if (callbackData != null) {
        callbackData(data);
      }

      if (callbackImages != null) {
        callbackImages(data);
      }

      this.urlActive = null;

      return;
    }

    $.ajax({
      url: urlString,
      type: 'GET',
      error: (jqXHR, textStatus, errorThrown) => {
        this.urlActive = null;


        console.error("LinkScrapper.getUrlData failed! " + textStatus + " ", errorThrown, jqXHR);
      },
      success: (res) => {
        console.log("LinkScrapper: url successfully loaded! ", res);

        var data = {};
        var metaName;
        var metaProperty;
        var metaContent;
        var imgSrc;

        data.imgSrcArray = [];

        this.imgArrayCounter = 0;

        //parse content
        var htmlString = res.responseText;

        if (htmlString == null) {
          //clear current cache
          console.log("htmlString is null ", res);
          this.scrapeCache[urlString] = null;

          if (callbackData != null) {
            callbackData(null);
          }

          if (callbackImages != null) {
            callbackImages(null);
          }
          return;
        }

        //parse html header elements
        var $htmlString = $(htmlString);
        var startIndex = htmlString.indexOf('<head>') + 6;
        var endIndex = htmlString.indexOf('</head>');
        var headerHTML = htmlString.substring(startIndex, endIndex);
        var $wrapper = $('<div />').html(headerHTML);
        var title = $("title", $wrapper).text();

        var baseURL = null;

        ($wrapper.find("base")).each(function (index, domElement) {
          baseURL = $(domElement).attr('href');
        }.$bind(this));

        data.title = title;
        data.url = urlString;

        ($wrapper.find("meta")).each(function (index, domElement) {
          metaName = $(domElement).attr('name');
          metaProperty = $(domElement).attr('property');
          metaContent = $(domElement).attr('content');

          if (metaName == undefined) {
            //check for images
            if (metaContent != null && ((metaContent.indexOf("http://") > -1 || metaContent.indexOf("https://") > -1) && (metaContent.indexOf(".jpg") > -1 || metaContent.indexOf(".jpeg") > -1 || metaContent.indexOf(".png") > -1 || metaContent.indexOf(".gif") > -1))) {
              metaName = "image";
            }
          }

          if (metaName == 'description' || metaName == 'Description' || metaName == "og:description" || metaProperty == "og:description") {
            //$('#scrapper_description').text(metaContent);
            data.description = metaContent;
          }

          if (metaName == 'image' || metaName == 'Image' || metaProperty == "image" || metaProperty == "og:image"|| metaName == 'og:image' ) {
            data.imgSrcArray.push(metaContent);
          }
        }.$bind(this));

        this.scrapeCache[urlString] = data;
        this.urlActive = null;
        this.__setSrapedData(urlString);

        if (callbackData != null) {
          callbackData(data);
        }

        /** trying to load all images */
        var alternativeImages = [];
        var alternativeImage = null;

        ($htmlString.find("img")).each(function (index, domElement) {
          imgSrc = $(domElement).attr('src');

          if (imgSrc != null && imgSrc.length > 0) {
            //TODO only fill absolute urls at first, check other urls...
            if (imgSrc.startsWith("//")) {
              //imgSrc = "http:" + imgSrc;
            } else if (imgSrc.startsWith("/")) {
              //imgSrc = urlString + imgSrc
              //TODO get host only
              alternativeImage = urlString + imgSrc;
              //push alternative images with baseURL
              if(baseURL != null) {
                var altImage = baseURL + imgSrc;
                if (alternativeImages.indexOf(altImage) < 0) {
                  alternativeImages.push(altImage);
                }
              }
            }

            if (imgSrc.indexOf("http://") < 0 && imgSrc.indexOf("https://") < 0) {
              //create correct url
              if (urlString.endsWith("/")) {
                alternativeImage = urlString + imgSrc;
              }
              else {
                alternativeImage = urlString + "/" + imgSrc;
              }

              if(baseURL != null) {
                var altImage = baseURL + imgSrc;
                if (alternativeImages.indexOf(altImage) < 0) {
                  alternativeImages.push(altImage);
                }
              }

              imgSrc = null;
            }

            //Log.debug("image found " + imgSrc);
            //do not push same image more than once
            if (alternativeImages.indexOf(alternativeImage) < 0 && alternativeImage != null) {
              alternativeImages.push(alternativeImage);
              alternativeImage = null;
            }

            if (data.imgSrcArray.indexOf(imgSrc) < 0 && imgSrc != null) {
              data.imgSrcArray.push(imgSrc)
            }
          }
        }.$bind(this));

        this.__checkImages(urlString, alternativeImages, callbackImages);
      }.$bind(this)
    })
  },

  /**
   * checks image validation, adds valid images, drops invalid adresses
   * @param alternativeImages
   */
  __checkImages: function (urlString, alternativeImages, callbackImages) {
    var data = this.scrapeCache[urlString];

    if (data == null) {
      if (callbackImages != null) {
        callbackImages(data);
      }
      return;
    }

    if (alternativeImages == null || alternativeImages.length == 0) {
      if (callbackImages != null) {
        callbackImages(data);
      }
      return;
    }

    var img = alternativeImages[0];
    var image = new Image();

    image.onload = () => {
      if (data.imgSrcArray.indexOf(image.src) < 0) {
        data.imgSrcArray.push(image.src);
      }

      if (alternativeImages.length > 1) {
        this.__checkImages(urlString, alternativeImages.slice(1, alternativeImages.length), callbackImages);
      }
      else {
        if (callbackImages != null) {
          callbackImages();
        }
      }
    };

    image.onerror = () => {
      if (alternativeImages.length > 1) {
        this.__checkImages(urlString, alternativeImages.slice(1, alternativeImages.length), callbackImages);
      }
      else if (callbackImages != null) {
        callbackImages();
      }
    };

    //start loading
    image.src = img;
  }

});
