import {  useState, useEffect} from "react"

import Options from "./Options"
import Instruction from "./Instruction"

let first = true;
function Download({links, show}) {

    const [data, setData] = useState({download: links, upload: [], diff: []});
    const [status, setStatus] = useState({download: false, upload: false});

    useEffect(() => {
        if (show && first)
            first = false;

        // Not render in the first effect
        if (show && !first) {
            setData(p => {
                const {download, upload} = actualData(p.upload, links);
                return {...p, download, upload}
            })

            setStatus(p => ({...p, download: true}))
        }
    }, [links])




    function loadFile(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsText(file)
        reader.onload = () => {
            const result = JSON.parse(reader.result);

            // May handle this algorithm at backend
            const {download, upload, diff, success} = extractChanges(result, e.target.id)

            // If file has a 0-length array, or invalid format
            if (!success)
                return

            setData({download, upload, diff});
            setStatus(p => ({...p, [e.target.id]: true}));
        }
    }

    function extractChanges(links, name) {
        // data must be an array (object)
        if (typeof links !== 'object') {
            alert('Your data is in wrong format');
            return {success: false}
        }

        const download = data.download;
        const upload = data.upload;

        const downloadLen = download.length;
        const uploadLen = upload.length;
        const linkLen = links.length;


        if (!linkLen || linkLen === 0) {
            alert('Your file has an empty data! Please insert new data.')
            return {success: false};
        }
         

        // Check array length of file, download, upload data
        if (name === 'download' && uploadLen === 0)
            return {download: links, upload: [], diff: [], success: true};

        if (name === 'upload' && downloadLen === 0)
            return {download: [], upload: links, diff: [], success: true};


        // Find the difference of 2 data.
        if (name === 'upload')
            return actualData(links, download);
        if (name === 'download')
            return actualData(upload, links)
        
        return {success: true};
    }   

    function actualData(inner, outer) {
        const downloadLen = outer.length;
        const upload = [...new Array(downloadLen)];
        let diff = [...new Array(downloadLen)];
        let diff_idx = 0;

        for (let i = 0; i < downloadLen; i++) {
            let count = 0;
            let matches; 

            for (let j = 0; j < inner.length; j++) {
                if (!checkFileData(inner[j]))
                    return {success: false};
                
                if (inner[j].name === outer[i].name) {
                    matches = inner[j];
                    count++;
                }
            }

            if (count > 1) {
                alert(`${outer[i].name} Download matches with ${count} Upload! Please make Upload unique name`)
                return {sucess: false};
            }

            if (count === 1) {
                upload[i] = matches;
                diff[diff_idx] = matches;
                diff_idx++; 
            } else {
                upload[i] = {url: '', name: '-------------'};
            }
            // upload[i] = count === 1 ? matches : {url: '', name: '-------------'}
        }

        diff = diff.slice(0, diff_idx);

        return {upload, download: outer, diff, success: true}
    }

    function checkFileData(obj) {
        // Must be an object
        if (typeof obj !== 'object')
            return false;

        // Must have 2 keys only => (name, url)
        const keys = Object.entries(obj);
        if (keys.length > 2 || keys.length < 2)
            return false;

        // Name and url must be a string. 
        const name = obj.name;
        const url = obj.url;
        if (typeof name !== 'string' || typeof url !== 'string')
            return false;

        return true;
    }



    const links_1 = data.download.map((obj, i) => {
        return <div className="option grey" key={obj.url}>
            <label className="tag-name" htmlFor="1">{obj.name}</label>

            <label className="checkbox-wrap show" htmlFor={obj.url}>
                <input type="checkbox" id={obj.url} className="checkbox-input" />
                <span className="checkmark red"></span>
            </label>
        </div>
    })

    const links_2 = data.upload.map((obj, i) => {
        return <div className="option grey" key={i}>
            <label className="tag-name" htmlFor="1">
                {obj.name}
            </label>

            <label className="checkbox-wrap show" htmlFor="1">
                <input type="checkbox" id="1" className="checkbox-input" />
                <span className="checkmark red"></span>
            </label>
        </div>
    })



    return <div className="selector mt-2">
    <div className="split-wrap gap-2">
        <div className="split half-break">
            {status.download || <div className="flex-row-center">
                                    <span className="ab-1 mt-1">
                                        <label htmlFor="download" className="btn">Open File</label>
                                        <input type="file" id="download" style={{visibility:"hidden", width: 0}} accept=".json" onChange={loadFile}/>
                                    </span>
                                    <div className="options load"></div>
                                </div>
            }
            {status.download && <div className="options">
                <span>
                    <label htmlFor="download" className="btn">Open File</label>
                    <input type="file" id="download" style={{visibility:"hidden", width: 0}} accept=".json" onChange={loadFile}/>
                </span>
                {links_1}
                </div>
            }

            {status.upload || <div className="flex-row-center">
                                    <span className="ab-1 mt-1">
                                        <label htmlFor="upload" className="btn">Open Compared File</label>
                                        <input type="file" id="upload" style={{visibility:"hidden", width: 0}} accept=".json" onChange={loadFile}/>
                                    </span>
                                    <div className="options load"></div>
                                </div>
            }
            {status.upload && <div className="options">
                <span>
                    <label htmlFor="upload" className="btn">Open Compared File</label>
                    <input type="file" id="upload" style={{visibility:"hidden", width: 0}} accept=".json" onChange={loadFile}/>
                </span>
                {links_2}
                </div>
            }
        </div>

        <Options links={data.diff}/>
    </div>

    {/* <Instruction/> */}
    </div>
}

export default Download