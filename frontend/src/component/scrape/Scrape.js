import {useState, useEffect, useRef} from 'react'
import axios from 'axios';

import Download from './Download';


const finxedUrl = 'http://localhost:5000/scrape'

const scrollInit = {delay: 0, size: 0, limit: 0}
const settingInit = {headless: true, bypass: false};

function Scrape() {
    const url = useRef(null);
    const selector = useRef(null);
    const alias_selector = useRef(null);

    const [scroll, setScroll] = useState(scrollInit);
    const [setting, setSetting] = useState(settingInit);
    const [links, setLinks] = useState([]);

    const [status, setStatus] = useState(false);
    const [scrape, setScrape] = useState(false);




    function handleSubmit() {
        const input = {};

        // Extract Input
        input.url = url.current.value;
        input.selector = selector.current.value;
        input.alias = alias_selector.current.value;

        // Extract settings
        const {headless, bypass, choice} = setting;

        axios.post(`${finxedUrl}/downloadLinks`, {...input, scroll, headless, bypass})
             .then(({data}) => {
                setLinks(data);
                setStatus(true);

                // Set UI to default settings
                setSetting(settingInit);
                setScroll(scrollInit);
                setScrape(false);
             })
             .catch(() => setStatus(false))
        
        setScrape(true);

        // Keep selector but clear the url input. 
        url.current.value = '';
    }

    function changeScroll(e) {
        const name = e.target.id.split('-')[1];
        let value = e.target.value;

        if (value !== '')
            value = Number(value);
        
        setScroll(prev => ({...prev, [name]: value}));
    }

    function changeSetting(e) {
        const name = e.target.id;
        const value = e.target.checked
        setSetting(prev => ({...prev, [name]: value}))
    }

    function onlyNumber(e) {
        if(!/[0-9]/.test(e.key) && e.key !== 'Backspace'  // allow delete
            && e.key !== 'ArrowUp' && e.key !== 'ArrowDown' // allow increase, decrease number
            && e.ket !== 'ArrowLeft' && e.key !== 'ArrowRight' // allo move left, right cursor
        ) {
            e.preventDefault()
        }
    }

    function exportFile() {
        // const element = document.createElement("a");
        // const file = new Blob([links[0]], {type: 'text/json', chatset: "utf-8"});
        // element.href = URL.createObjectURL(file);
        // element.download = "links.json";
        // document.body.appendChild(element); // Required for this to work in FireFox
        // element.click();

        // document.body.removeChild(element);
        // URL.revokeObjectURL(element.href);

        const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
            JSON.stringify(links)
        )}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = "links.json";
    
        link.click();
    }




    return <main>
    <div className="wrapper">
        <form className="compiler split-wrap gap-2" onSubmit={e => e.preventDefault()}>
            <div className='half-break'>
                <div className="mb-1">
                    <label htmlFor="1" className="label mb-1">Url</label>
                    <input type="text" id="1" className="input" ref={url} required/>
                </div>
                <div className="mb-1">
                    <label htmlFor="1" className="label mb-1">Selector</label>
                    <input type="text" className="input" ref={selector} required/>
                </div>
                <div className="mb-1">
                    <label htmlFor="1" className="label mb-1">Alias Selector</label>
                    <input type="text" className="input" ref={alias_selector} required/>
                </div>
            </div>

            <div className='half-break split'>
                <div>
                    <div className="mb-1">
                        <label htmlFor="scroll-delay" className="label mb-1">Scroll Delay (ms)</label>
                        <input type="number" name="maxQueue" id="scroll-delay" min="0" max="100" className="input-small" 
                                value={scroll.delay} onChange={changeScroll} onKeyDown={onlyNumber}/>
                    </div>

                    <div className="mb-1">
                        <label htmlFor="scroll-height" className="label mb-1">Scroll Height (px)</label>
                        <input type="number" name="wait" id="scroll-size" min="0" max="500" className="input-small" 
                                value={scroll.size} onChange={changeScroll} onKeyDown={onlyNumber}/>
                    </div>

                    <div className="mb-1">
                        <label htmlFor="iteration" className="label mb-1">Iteration</label>
                        <input type="number" name="imageSize" id="scroll-limit" min="0" max="100" className="input-small" 
                                value={scroll.limit} onChange={changeScroll} onKeyDown={onlyNumber}/>
                    </div>
                </div>

                <div>
                    <span className="label">Settings</span>
                    <div>
                        <input type="checkbox" name="headless" id="headless" 
                                checked={setting.headless} onChange={changeSetting}/>
                        <label htmlFor="headless"> Headless Browser</label>
                    </div>
                    <div>
                        <input type="checkbox" name="bypass" id="bypass"
                                checked={setting.bypass} onChange={changeSetting}/>
                        <label htmlFor="bypass"> Bypass Bot</label>
                    </div>
                </div>
            </div>
        </form>

        <div className="flex-row-center gap-2">
            <button className="btn" onClick={handleSubmit}>Scrape</button>
            {status &&  <button className="btn" onClick={exportFile}>Export Result</button>}
        </div>
        
        {status && <div className="flex-center mt-1">{links.length} result found.</div>}
        {scrape && <div className="flex-center mt-1">Scrapping... Please wait!</div>}

        <Download show={status} links={links}/>
    </div>
</main>
}

export default Scrape