import {useState, useEffect, useRef, useId} from 'react';
import axios from 'axios'


const DOWNLOAD_ALL = 'DOWNLOAD_ALL';
const DOWNLOAD_DIFF = 'DOWNLOAD_DIFF';
const DOWNLOAD_SELECT = 'DOWNLOAD_SELECT';

const NONE = 'none'

const settingInit = {
    downloadType: DOWNLOAD_ALL, // ALL, DIFF, SELECT,

    maxQueue: 20,
    waitQueue: 0,
    imageSize: 0,

    headless: false,
    optimize: true,
    bypass: false,

    
    png: true,
    jpg: true,
    webp: true,

    convertTo: NONE
}

const fixedURL = 'http://localhost:5000/scrape';
const headers = {
    'Content-Type': 'application/json'
}

function Options({links}) {
    const queryImage = useRef(null);
    const path = useRef(null);

    const [setting, setSetting] = useState(settingInit);
    const id = useId();

    function handleSubmit(e) {
        e.preventDefault();

        const data = {};
        data.queryImage = queryImage.current.value;
        data.path = path.current.value;

        data.headless = setting.headless;
        data.bypass = setting.bypass;

        data.maxQueue = Number(setting.maxQueue);
        data.waitQueue = Number(setting.waitQueue);
        data.imageSize = Number(setting.imageSize);

        data.imgTypes = [];
        if (setting.png) data.imgTypes.push('png');
        if (setting.jpg) data.imgTypes.push('jpg');
        if (setting.webp) data.imgTypes.push('webp');

        data.convertTo = setting.convertTo.toLowerCase();

        axios.post(`${fixedURL}/downloadImages`, data, {headers})
             .then(data => console.log('Sucess'))
             .catch(err => console.log(err))
    }

    function changeDownload(e) {
        setSetting(p => ({...p, downloadType: e.target.id}))
    }

    function changeQueue(e) {
        setSetting(p => ({...p, [e.target.name]: e.target.value}))
    }

    function changeBrowser(e) {
        setSetting(p => ( {...p, [e.target.name]: e.target.checked} ))
    }

    function changeImage(e) {
        setSetting(p => ( {...p, [e.target.id]: e.target.checked} ))
    }

    function convertTo(e) {
        setSetting(p => ( {...p, convertTo: e.target.id.slice(2)} ))
    }

    return <form className="half-break" onSubmit={handleSubmit}>
        <div className="mb-2">
            <label htmlFor="imageQuery" className="label mb-1">Image Query</label>
            <input type="text" className="input" id="imageQuery" required 
                    placeholder="Query Selector for each link" ref={queryImage}/>

            <label htmlFor="imageQuery" className="label mb-1 mt-1">Path Location</label>
            <input type="text" className="input" id="imageQuery" required 
                    placeholder="Ex: D:\\Folder 1\\Folder 2" ref={path}/>
        </div>

        <div className="flex-between mb-2">
            <div>
                <input type="radio" name="download" id={DOWNLOAD_ALL} onChange={changeDownload}/>
                <label htmlFor={DOWNLOAD_ALL}>Download All</label>
            </div>
            <div>
                <input type="radio" name="download" id={DOWNLOAD_DIFF} onChange={changeDownload}/>
                <label htmlFor={DOWNLOAD_DIFF}>Download by Difference</label>
            </div>
            <div>
                <input type="radio" name="download" id={DOWNLOAD_SELECT} onChange={changeDownload}/>
                <label htmlFor={DOWNLOAD_SELECT}>Download by Selection</label>
            </div>
        </div>
        
        <div className="split">
            <div>
                <div className="mb-1">
                    <label htmlFor="maxQueue" className="label">Max Queue (source)</label>
                    <input type="number" name="maxQueue" id="maxQueue" min="1" max="700" className="input-small" 
                            value={setting.maxQueue} onChange={changeQueue} />
                </div>

                <div className="mb-1">
                    <label htmlFor="wait" className="label">Wait Queue (s)</label>
                    <input type="number" name="waitQueue" id="waitQueue" min="0" max="1800" className="input-small" 
                            value={setting.waitQueue} onChange={changeQueue} />
                </div>

                <div className="mb-1">
                    <label htmlFor="imageSize" className="label">Max Single Image Size (MB)</label>
                    <input type="number" name="imageSize" id="imageSize" min="1" max="30" className="input-small" 
                            value={setting.imageSize} onChange={changeQueue} />
                </div>
            </div>

            <div>
                <div>
                    <input type="checkbox" name="headless" id={`headless-${id}`} 
                            checked={setting.headless} onChange={changeBrowser} />
                    <label htmlFor={`headless-${id}`}> Headless Browser</label>
                </div>
                <div>
                    <input type="checkbox" name="optimize" id={`optimize-${id}`} disabled checked/>
                    <label htmlFor={`optimize-${id}`}> Optimize</label>
                </div>
                <div>
                    <input type="checkbox" name="bypass" id={`bypass-${id}`} 
                            checked={setting.bypass} onChange={changeBrowser} />
                    <label htmlFor={`bypass-${id}`}> Bypass Bot</label>
                </div>
                
                <div className="mt-1">
                    <span>Download image type</span>
                    <div>
                        <input type="checkbox" name="png" id="png" 
                                checked={setting.png} onChange={changeImage} />
                        <label htmlFor="png"> PNG</label>
                    </div>
                    <div>
                        <input type="checkbox" name="jpg|jpeg" id="jpg" 
                                checked={setting.jpg} onChange={changeImage} />
                        <label htmlFor="jpg"> JPG | JPEG</label>
                    </div>
                    <div>
                        <input type="checkbox" name="webp" id="webp" 
                                checked={setting.webp} onChange={changeImage} />
                        <label htmlFor="webp"> WEBP</label>
                    </div>
                </div>

                <div className="mt-1">
                    <span >Convert Image</span>
                    <div>
                        <input type="radio" name="convertTo" id="toDefault" defaultChecked
                                onChange={convertTo} />
                        <label htmlFor="toDefault"> Keep Original</label>
                    </div>
                    <div>
                        <input type="radio" name="convertTo" id="toPNG"
                                onChange={convertTo} />
                        <label htmlFor="toPNG"> to PNG</label>
                    </div>
                    <div>
                        <input type="radio" name="convertTo" id="toJPG"
                                onChange={convertTo} />
                        <label htmlFor="toJPG"> to JPEG</label>
                    </div>
                </div>
            </div>
        </div>

        <div className="flex-end">
            <button className="btn">Scrape</button>
        </div>
    </form>
}

export default Options