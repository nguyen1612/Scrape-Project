function Instruction() {
    return <div className="mt-2">
    <h3>Setting Instructions</h3>
        <div className="instructions">
            <div className="">
                <div className="mb-2">
                    <strong className="title">Download Options</strong>
                    <div className="constrain mt-1">
                        <ul className="list">
                            <li className="title-small"><span className="list-key">Download All</span>: Donwload all links regardless overlapping with older source or not</li>
                            <li className="title-small"><span className="list-key">Download by Difference</span>: Download only the differences found in the new scrapping result</li>
                            <li className="title-small"><span className="list-key">Download by Selection</span>: Download by user selections</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="">
                <div className="mb-2">
                    <strong className="title">Max Queue</strong>
                    <div className="constrain mt-1">
                        <ul className="list">
                            <li className="title-small"><span className="list-key">Default</span>: 20 (tabs)</li>
                            <li className="title-small"><span className="list-key">Min</span>: 1 (tabs)</li>
                            <li className="title-small"><span className="list-key">Max</span>: 700 (tabs)</li>
                        </ul>
                    </div>
                    <p className="desc mt-1" style={{whiteSpace: "pre-line"}}>{`- Total tabs that a browser will open for downloading target sources once at a time. Other sources are pending (in queues) until all previous targets finished.
                        
                        - More tabs will result in RAM consumption and low Internet speed due to loading all resouces at once. 
                        
                        - If you have 16GB RAM memory and each tab takes 30MB, then 200-300 tabs might be enough (~9GB). Although you can increase as high as you want, the internet speed normally not as high as you expected

                        - <i className="txt-red">NOTICE:</i> you should consider the Internet speed and external resources that your computer and the browser itself consume as well.
                    `}</p>
                </div>
                <div className="mb-2">
                    <strong className="title">Wait Queue</strong>
                    <div className="constrain mt-1">
                        <ul className="list">
                            <li className="title-small"><span className="list-key">Default</span>: 0 (seconds)</li>
                            <li className="title-small"><span className="list-key">Min</span>: 0 (seconds)</li>
                            <li className="title-small"><span className="list-key">Max</span>: 1800 (seconds)</li>
                        </ul>
                    </div>
                    <p className="desc mt-1" style={{whiteSpace: "pre-line"}}>{`- Total seconds between queues.

                        - Usually, you don't want a wait time during scrapping. But the target website might have a CDN or bot detection to prevent scrapping (might be total of accesses their website in short amount of time). Therefore, increase wait time may help you against the block.
                    
                    `}
                        - <i className="txt-red">NOTICE:</i> This will not guarantee you will success bypass bot detection. The technology to detect bot is various. This is just a factor among them. You should combine other options together to have a high chance of succsess.
                    </p>
                </div>
                
                <div className="mb-2">
                    <strong className="title">Max Single Image Size</strong>
                    <div className="constrain mt-1">
                        <ul className="list">
                            <li className="title-small"><span className="list-key">Default</span>: 0 (MB)</li>
                            <li className="title-small"><span className="list-key">Min</span>: 1 (MB)</li>
                            <li className="title-small"><span className="list-key">Max</span>: 30 (MB)</li>
                        </ul>
                    </div>
                    <p className="desc mt-1" style={{whiteSpace: "pre-line"}}>
                    {`- Total MB for a single image in a tab. Images exceed the limit size will be ignored.
                    
                    `}
                        - <i className="txt-red">NOTICE:</i> If you don't want a limit size on an image, set it to 0. It will download images regardless of its size.
                    </p>
                </div>
            </div>

            <div className="">
                <div className="mb-2">
                    <strong className="title">Open Browser</strong>
                    <div className="constrain mt-1">
                        <ul className="list">
                            <li className="title-small"><span className="list-key">Default</span>: False</li>
                        </ul>
                    </div>
                    <p className="desc mt-1" style={{whiteSpace: "pre-line"}}>
                    {`- Check the box to open the Chrome browser. Ohter browsers may not work.
                        
                        - Without opening chrome browser, you can gain more peformance but may be blocked by bot detection, even though you select the <span className="list-key">Bypass Bot</span> option.
                    
                    `}
                        - <i className="txt-red">NOTICE:</i> Chromium might be selected if Chrome browser is not found.
                    </p>
                </div>

                <div className="mb-2">
                    <strong className="title">Optimize</strong>
                    <div className="constrain mt-1">
                        <ul className="list">
                            <li className="title-small"><span className="list-key">Default</span>: True</li>
                        </ul>
                    </div>
                    <p className="desc mt-1" style={{whiteSpace: "pre-line"}}>- Rather download each tab in a queue one by one, asynchronous technique applied to download all tabs at once.
                        
                        - You can send another request to the server to download other pages (New request). The server will open another browser to download new sources. Therefore, you can download many sources at a time.
                    </p>
                </div>

                <div className="mb-2">
                    <strong className="title">Bypass Bot</strong>
                    <div className="constrain mt-1">
                        <ul className="list">
                            <li className="title-small"><span className="list-key">Default</span>: False</li>
                        </ul>
                    </div>
                    <p className="desc mt-1" style={{whiteSpace: "pre-line"}}>
                    {`- Applied technique to bypass bot detection from the website. Performance gain is slower.

                        If you know the target website does not turn on bot detection, then you don't have to turn on this feature.
                    
                    `}
                        - The <span className="list-key">Bypass Bot</span> option use <a href="https://www.npmjs.com/package/puppeteer-extra">puppeteer-extra</a> library.
                        <br/><br/>
                        - <i className="txt-red">NOTICE:</i> To maximize chance to bypass bot detection, you can apply following settings:

                        <ul className="list mt-1">
                            <li><span className="list-key mb-2">Bypass Bot</span>: True</li>
                            <li><span className="list-key mb-1">Open Browser</span> True</li>
                            <li><span className="list-key mb-1">Max Queue</span> 20-50 tabs (optional but should not too much)</li>
                            <li><span className="list-key mb-1">Wait Queue</span> 5 (optional but bigger is better)</li>
                        </ul>
                    </p>
                </div>

            </div>
        </div>
    </div>
}

export default Instruction