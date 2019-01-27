interface PortalLandingPageConfig {
    portalUrl: string;
    group: string;
}

declare var arcgisPortalLandingPageConfig: PortalLandingPageConfig;
if (!arcgisPortalLandingPageConfig) {
    arcgisPortalLandingPageConfig = {} as any;
} 

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get("group")) {
    arcgisPortalLandingPageConfig.group = urlParams.get("group");
}
if (urlParams.get("portalUrl")) {
    arcgisPortalLandingPageConfig.portalUrl = urlParams.get("portalUrl");
}

// Initialize config with default values if needed

let arcgisPortalList: PortalLandingPageConfig[] = [
    { portalUrl: "https://www.arcgis.com",  group: "1d1f24e8556642f49448f1c88b5a571b"  },
    { portalUrl: "http://www.arcgis.com",  group: "1d1f24e8556642f49448f1c88b5a571b"  }, // http
    { portalUrl: "https://mapy.umgdy.gov.pl/pzp",  group: "a9dd8d5f05b5479f8c4875de746d4cda"  },
    { portalUrl: "https://mapy.umgdy.gov.pl/portal", group: "9227744bd89342429da120fb3bba224a" }
];

if (!arcgisPortalLandingPageConfig.portalUrl){
    for (const portal of arcgisPortalList) {
        if (window.location.href.indexOf(portal.portalUrl) === 0) {
            arcgisPortalLandingPageConfig.portalUrl = portal.portalUrl;
        }        
    }
    if (!arcgisPortalLandingPageConfig.portalUrl){
        arcgisPortalLandingPageConfig.portalUrl = arcgisPortalList[0].portalUrl; // Set first item as default

        // https://portal.myorg.com:7443/arcgis/home     (Direct URL)
        // https://maps.myorg.com/portal/home            (Web Adaptor URL)
        /*
        arcgisPortalLandingPageConfig.portalUrl = 
            window.location.origin +  "/" +             // https://portal.myorg.org:7443  |  https://maps.myorg.com
            window.location.pathname.split("/")[1];     // /arcgis/home                   |  /portal/home 
        */
    }
    console.log("Default ArcGIS Portal url is set: ", arcgisPortalLandingPageConfig.portalUrl)
}

if (!arcgisPortalLandingPageConfig.group) {
    let portalUrl = arcgisPortalLandingPageConfig.portalUrl; //.toLowerCase();
    for (const portal of arcgisPortalList) {
        if (portalUrl.indexOf(portal.portalUrl) === 0) {
            arcgisPortalLandingPageConfig.group = portal.group;
        }        
    }
    if (arcgisPortalLandingPageConfig.group) {
        console.log("Default ArcGIS Portal group is set: " + arcgisPortalLandingPageConfig.group);
    }
    else {
        console.error("Unable to load group items: ArcGIS Portal group is not set.");
    }
}



interface RestApiJson {
    error: {
        message: string;
        details: string;
    }
}


/** https://developers.arcgis.com/rest/users-groups-and-items/portal-self.htm */
interface PortalJson extends RestApiJson {

    /** The organization's name, eg. 'MyOrg GIS Portal*/
    name: string; 

    /** The portal's name: "ArcGIS Online" | "ArcGIS Enterprise" */
    portalName: string; 

    /** The URL to the thumbnail of the portal. */
    portalThumbnail: string;

    /** The URL to the thumbnail of the organization. */
    thumbnail: string;

    currentVersion: number;


    portalUrl: string;
    thumbnailUrl: string;
}



interface GroupJson extends RestApiJson {
    title: string;
    description: string;
    snippet: string;
    thumbnail: string;
    id: string;

    groupUrl: string;
    thumbnailUrl: string;
}



/** https://developers.arcgis.com/rest/users-groups-and-items/items-and-item-types.htm */
type ItemType = 
        // Maps
          "Web Map" 
        | "CityEngine Web Scene"
        | "Web Scene"
        | "360 VR Experience"
        | "Pro Map"
        | "Map Area"
        // Layers
        | "Feature Service"
        | "Map Service"
        | "Image Service"
        | "KML"
        | "KML Collection"
        | "WMS"
        | "WFS"
        | "WMTS"
        | "Feature Collection"
        | "Feature Collection Template"
        | "Geodata Service"
        | "Globe Service"
        | "Vector Tile Service"
        | "Scene Service"
        | "Relational Database Connection"
        | "Oriented Imagery Catalog"
        // Tools
        | "Geometry Service"
        | "Geocoding Service"
        | "Network Analysis Service"
        | "Geoprocessing Service"
        | "Workflow Manager Service";
        // Applications (TODO)
        // Data files (TODO)
        // Desktop content (TODO)


interface ItemJson {
    id: string;
    title: string; // World Reference Overlay
    name: string; // World_Reference_Overlay
    snippet: string;
    description: string;
    url: string;
    owner: string;
    created: number;
    modified: number;
    type: ItemType;
    typeKeywords: string[];
    tags: string[];

    thumbnail: string;
    extent: any;
    spatialReference: any;
    accessInformation: string; //<credits>,
    licenseInfo: string; // "<access and use constraints>"
    culture: string; //"<culture code>",
    access: "private | shared | org | public";
    size: number;
    numComments: number;
    numRatings: number;
    avgRating: number;
    numViews: number;
    scoreCompleteness: number;
    groupCategories: string[];
      
    itemUrl: string;
    thumbnailUrl: string;
}

interface ItemsJson {
    items: ItemJson[];
}

let isDebugDebugMode = window.location.href.indexOf("/localhost") > 0;


class AppIcons {

    /** https://feathericons.com */
    private static featherIcon(path: string, size: number = 24){
        return `<svg xmlns="http://www.w3.org/2000/svg" width="` + size + `" height="` + size + `" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="align-top mr-2">` + path + `</svg>`;
    }
    public static info(size?: number) {
        return AppIcons.featherIcon(`<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="8"></line>`, size);
    }
    public static externalLink(size?: number) {
        return AppIcons.featherIcon (`<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line>`, size);
    }
    public static download(size?: number) {
        return AppIcons.featherIcon (`<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line>`, size);
    }
    public static search(size?: number) {
        return AppIcons.featherIcon (`<circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>`, size);
    }
    public static home(size?: number) {
        return AppIcons.featherIcon (`<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline>`, size);
    }
    public static list(size?: number) {
        return AppIcons.featherIcon (`<line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3" y2="6"></line><line x1="3" y1="12" x2="3" y2="12"></line><line x1="3" y1="18" x2="3" y2="18"></line>`, size);
    } 
    public static chevronsDown(size?: number) {
        return AppIcons.featherIcon (`<polyline points="7 13 12 18 17 13"></polyline><polyline points="7 6 12 11 17 6"></polyline>`, size);
    } 
    public static map(size?: number) {
        return AppIcons.featherIcon (`<polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line>`, size);
    } 


    /** https://useiconic.com/open */
    private static iconicIcon(path: string, size: number = 24) {
        return `<svg xmlns="http://www.w3.org/2000/svg" width="` + size + `" height="` + size + `" viewBox="0 0 8 8"  class="align-top mr-2">` + path + `</svg>`;
    }
    public static listRich(size?: number) {
        return AppIcons.iconicIcon(`<path d="M0 0v3h3v-3h-3zm4 0v1h4v-1h-4zm0 2v1h3v-1h-3zm-4 2v3h3v-3h-3zm4 0v1h4v-1h-4zm0 2v1h3v-1h-3z" />`, size); 
    }
}



class AppView {

    private navbarTitleContainer = document.getElementById("navbarTitleContainer") as HTMLAnchorElement;    
    private searchBoxElement = document.getElementById("searchBoxElement");
    private searchButtonElement = document.getElementById("searchButtonElement");

    private groupHeadingContainer = document.getElementById("groupHeadingContainer") ;
    private groupItemsContainer = document.getElementById("groupItemsContainer");
    private loadMoreItemsButton = document.getElementById("loadMoreItemsButton") as HTMLButtonElement;

    private portalDeltailsContainer = document.getElementById("portalDeltailsContainer");
    private groupDetailsContainer = document.getElementById("groupDetailsContainer");

    private splashScreenModal = document.getElementById("splashScreenModal");
    private splashScreenBackdrop = document.getElementById("splashScreenBackdrop");


    constructor(public portalUrl: string) {       
        this.loadMoreItemsButton.addEventListener("click", ()=> {
            this.appendMoreItems();
        });
    }

    public hideSplashScreen() {
        this.splashScreenModal.classList.remove("show");
        this.splashScreenBackdrop.classList.remove("show");
        setTimeout(() => {
            this.splashScreenModal.style.display = "none";
            this.splashScreenBackdrop.style.display = "none";
        }, 300);
    }

    public showError (err: any) {
        this.splashScreenModal.classList.add("text-danger");
        (this.splashScreenModal.getElementsByClassName("modal-header").item(0) as HTMLElement).style.display = "";        
        this.splashScreenModal.getElementsByClassName("modal-title").item(0).innerHTML = "Error";
        this.splashScreenModal.getElementsByClassName("modal-body").item(0).innerHTML = err.message || err;
    }

    private setFooterContainerAnchor(container: HTMLElement, text: string, url: string, thumbnailUrl: string, iconSvg: string) {        
        container.innerHTML = "";

        let anchor = this.appendAnchor(container, null, iconSvg, url); // innerHTML has only default iconSvg
        //if (thumbnailUrl) {
        //    anchor.innerHTML = `<img src="` + thumbnailUrl + `" width="24" height="24" class="align-top mr-2 mb-2" alt="">`;
        //}
        anchor.innerHTML = anchor.innerHTML + text;
    }

    public setPortalData(portal: PortalJson) {
        if (isDebugDebugMode) {
            console.log("portal: ", portal);
        }
        console.log("ArcGIS Portal version: ", portal.currentVersion);
        if (portal.currentVersion < 6.1) {
            console.log("This app was tested with ArcGIS Portal 6.1 version. Your version of ArcGIS Portal (" + portal.currentVersion + ") may not function properly.");
        }
        else {
            console.log("ArcGIS Portal version: ", portal.currentVersion);            
        }
        let portalName = portal.name || portal.portalName;
        this.setFooterContainerAnchor(this.portalDeltailsContainer, portalName, portal.portalUrl, portal.thumbnailUrl, AppIcons.home());
    }

    public setGroupData(group: GroupJson) {
        if (isDebugDebugMode) {
            console.log("group: ", group);
        }

        document.title = group.title;

        this.navbarTitleContainer.innerHTML = "";
        this.navbarTitleContainer.href = window.location.href;
        if (group.thumbnail) {
            this.navbarTitleContainer.innerHTML = this.navbarTitleContainer.innerHTML + `
            <img src="` + group.thumbnailUrl + `" width="30" height="30" class="d-inline-block align-top" alt="">&nbsp;`;
        }
        this.navbarTitleContainer.innerHTML = this.navbarTitleContainer.innerHTML + group.title;

        this.groupHeadingContainer.innerHTML = `<h1 class="display-4 text-center">` + group.title + `</h1>`
        if (group.snippet) {
            this.groupHeadingContainer.innerHTML = this.groupHeadingContainer.innerHTML + `
            <p class="lead text-center">` + group.snippet + `</p>`;
        }
        if (group.description) {
            this.groupHeadingContainer.innerHTML = this.groupHeadingContainer.innerHTML + `
            <p class="text-justify">` + group.description + `</p>`;
        }        

        this.setFooterContainerAnchor(this.groupDetailsContainer, group.title, group.groupUrl, group.thumbnailUrl, AppIcons.list());
    }

    private items: ItemJson[];
    private loadedItemsCount = 0;
    private itemsPerPage = 16;

    public setItemsData(groupItems: ItemsJson, portalUrl: string) {
        if (isDebugDebugMode) {
            console.log("items: ", groupItems);
        }

        this.items = groupItems.items;
        this.loadedItemsCount = 0;
        this.groupItemsContainer.innerHTML = "";
        this.loadMoreItemsButton.style.display = "";
        this.appendMoreItems();
    }

    private appendMoreItems(){
        let lastItemNo = this.loadedItemsCount + this.itemsPerPage;
        if (lastItemNo >= this.items.length) {
            lastItemNo = this.items.length;
            this.loadMoreItemsButton.style.display = "none";
        }

        for (let i = this.loadedItemsCount; i < lastItemNo; i++) {
            this.appendItemData(this.items[i]);
        }
        this.loadedItemsCount = lastItemNo;
        this.loadMoreItemsButton.title = this.loadedItemsCount + "/" + this.items.length;
    }

    public appendItemData(item: ItemJson) {
        let itemInfoUrl = this.portalUrl + "home/item.html?id=" + item.id;
        let itemUrl = item.url;
        let itemData = this.portalUrl + "sharing/rest/content/items/" + item.id + "/data";

        let itemCard = this.appendDiv(this.groupItemsContainer, "card mb-4 shadow");
        let itemRow = this.appendDiv(itemCard, "row  no-gutters");

        let itemImgAnchor = this.appendAnchor(itemRow, "col-sm-4", "", itemUrl || itemData);
        let itemImg = this.appendImg(itemImgAnchor);  
        if (item.thumbnail) {
            itemImg.src = this.portalUrl + "sharing/rest/content/items/" + item.id + "/info/" + item.thumbnail;            
        }
        else {
            itemImg.src = "img/item.png";
        }
        itemImg.alt = item.type;

        if (item.snippet && ! item.description) {
            // If there is no description display snippet in multi-line mode
            item.description = item.snippet;
            item.snippet = "";
        }

        let itemBody = this.appendDiv(itemRow, "col-sm-8 card-body d-flex flex-column");
        let itemTitleAnchor = this.appendAnchor(itemBody, null, null, itemUrl || itemData);
        this.appendElement(itemTitleAnchor, "h5", "card-title", item.title).title = item.title;
        if (item.snippet) {
            this.appendElement(itemBody, "h6", "card-subtitle mb-2 text-muted", item.snippet).title = item.snippet;
        }
        if (item.description) {
            this.appendElement(itemBody, "p", "card-text", item.description);
        }
        let itemLinks = this.appendDiv(itemBody, "mt-auto");
        this.appendAnchor(itemLinks, "card-link", AppIcons.info(), itemInfoUrl);
        if (itemUrl) {
            this.appendAnchor(itemLinks, "card-link", AppIcons.externalLink(), itemUrl);
        }
        else {
            this.appendAnchor(itemLinks, "card-link", AppIcons.download(), itemData);
        }
        //urlLink.title = item.type;
        //urlLink.rel = item.type;
    }    


    private appendElement(owner: HTMLElement, tag: string,  className: string, html: string) {
        let e = document.createElement(tag);
        if (className) {
            e.className = className;
        }
        if (html) {
            e.innerHTML = html;
        }
        owner.appendChild(e);
        return e;
    }
    private appendDiv(owner: HTMLElement, className?: string) {
        return this.appendElement(owner, "div", className, undefined);
    }
    private appendImg(owner: HTMLElement, className?: string) {
        return this.appendElement(owner, "img", className, undefined) as HTMLImageElement;
    }
    private appendAnchor(owner: HTMLElement, className: string, html: string, url: string) {
        let a =  this.appendElement(owner, "a", className, html) as HTMLAnchorElement;
        a.target = "_blank";
        a.href = url;
        return a;
    }    

}



class AppController {

    public view: AppView;
    public portal: PortalJson;
    public group: GroupJson;
    public items: ItemsJson;

    constructor(public portalUrl: string, public groupId: string) {
        if (portalUrl.lastIndexOf("/") != portalUrl.length -1){
            this.portalUrl = portalUrl + "/";
        }
    }

    public loadAppData(): Promise<any> {
        this.view = new AppView(this.portalUrl);
        return Promise.all([
            this.loadPortalData(), 
            this.loadGroupData(), 
            this.loadItemsData()]
        )
        .then(()=> {
            this.view.hideSplashScreen();
        })
        .catch((reason) => {
            console.warn("App loading error: ", reason);
            this.view.showError(reason);
            return reason;
        });
    }

    private rootUrl(apiUrl: string): string {
        return this.portalUrl + "sharing/rest/" + apiUrl;
    }
    private communityUrl(apiUrl: string): string {
        return this.rootUrl("community/") + apiUrl;
    }
    private groupUrl(apiUrl: string): string {
        return this.communityUrl("groups/") + apiUrl;
    }
    private contentUrl(apiUrl: string): string {
        return this.rootUrl("content/") + apiUrl;
    }

    private fetchJson(url: string): Promise<any> {
        url = url + "?f=json";

        return fetch(url)
        .then((resp) => {
            //console.log("fetch success", resp);
            if (!resp.ok) {
                console.warn("Fetching ERROR: " + url);
                console.warn("HTTP response error", resp);
                throw new Error('HTTP error, status = ' + resp.status);
            }
            return resp.json();
        })
        .then((json: RestApiJson) => {
            if (json.error) {
                console.warn("Fetching ArcGIS Portal Rest API response errror: " + json.error.message);
                console.warn(url);
                throw new Error("Fetching ArcGIS Portal Rest API response errror: " + json.error.message);
            }
            return json;
        })        
        .catch((reason) => {
            console.warn("fetch error", reason);
            throw reason;
        });
    }

    private loadPortalData(): Promise<any> {
        return this.fetchJson(this.rootUrl("portals/self"))
            .then((portal: PortalJson) => {
                if (portal.thumbnail) {
                    portal.thumbnailUrl = this.portalUrl + "sharing/rest/portals/self/resources/" + portal.thumbnail; //thumbnail.png
                }
                else if (portal.portalThumbnail) {
                    portal.thumbnailUrl = this.portalUrl + "sharing/rest/portals/self/resources/" + portal.portalThumbnail; //thumbnail.png
                }
                portal.portalUrl = this.portalUrl;
                this.view.setPortalData(portal);
                return portal;
            })
            .catch((reason)=> {
                throw new Error("Failed to load Portal info " + this.portalUrl);
            });
    }

    private loadGroupData(): Promise<any> {        
        return this.fetchJson(this.groupUrl(this.groupId))
            .then((group: GroupJson)=> {
                // https://www.arcgis.com/sharing/rest/community/groups/a9dd8d5f05b5479f8c4875de746d4cda/info/Esri_Logo_13.jpg?token=
                if (group.thumbnail) {
                    group.thumbnailUrl = this.groupUrl(this.groupId + "/info/" + group.thumbnail);
                }
                group.groupUrl = this.portalUrl + "home/group.html?id=" + this.groupId;
                this.view.setGroupData(group);
                return group;
            })
            .catch((reason)=> {
                throw new Error("Failed to load Group info " + this.portalUrl + "home/group.html?id=" + this.groupId);
            });
    }

    private loadItemsData(): Promise<any> {        
        // /content/items/<itemId>
        return this.fetchJson(this.contentUrl("groups/" + this.groupId))
        .then((items: ItemsJson)=> {
            this.view.setItemsData(items, this.portalUrl);
        })
        .catch((reason)=> {
            throw new Error("Failed to load Group items " + this.portalUrl + "home/group.html?id=" + this.groupId);
        });
    }

}


if (isDebugDebugMode) {
    console.log("Loading ArcGIS Portal data", arcgisPortalLandingPageConfig);
}
let app = new AppController(arcgisPortalLandingPageConfig.portalUrl, arcgisPortalLandingPageConfig.group);
app.loadAppData();

