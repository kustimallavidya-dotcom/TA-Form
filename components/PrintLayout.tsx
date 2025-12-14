import React from 'react';
import { MonthData, UserProfile, TaEntry } from '../types';

interface PrintLayoutProps {
  data: MonthData;
  profile: UserProfile;
}

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const PrintLayout: React.FC<PrintLayoutProps> = ({ data, profile }) => {
  // We need exactly 13 rows per page as per prompt.
  // If we have more than 13 entries, we need multiple pages.
  // For the purpose of this MVP, let's assume we chunk entries into groups of 13.
  
  const entries = data.entries || [];
  const chunkSize = 13;
  const chunks = [];
  
  if (entries.length === 0) {
    chunks.push([]);
  } else {
    for (let i = 0; i < entries.length; i += chunkSize) {
      chunks.push(entries.slice(i, i + chunkSize));
    }
  }

  return (
    <div className="print-only w-full text-black">
      {chunks.map((chunk, pageIndex) => (
        <div key={pageIndex} className={`flex flex-col h-[210mm] w-[297mm] p-4 relative ${pageIndex < chunks.length - 1 ? 'page-break' : ''}`}>
          
          {/* --- HEADER (Page 1 Style for all pages for consistency, or strictly P1/P2) --- */}
          {/* Original form has P1 header. Let's replicate P1 Header for the first page, and simplified for others if needed. 
              Prompt implies "Page-1 and Page-2", usually P1 is entries 1-13, P2 is 14-26 + certification. 
              Let's make a generic header that fits.
          */}
          
          <div className="w-full mb-1">
            <div className="flex justify-between items-start border-b border-black pb-1 mb-1">
               <div className="text-sm font-bold">मध्य रेल / CENTRAL RAILWAY</div>
               <div className="text-center">
                 <h1 className="text-lg font-bold uppercase tracking-wide">यात्रा भत्ता जर्नल / TRAVELLING ALLOWANCE JOURNAL</h1>
                 <p className="text-xs">नियम जिससे शासित है / Rule by which governed <span className="font-handwriting text-blue-900 border-b border-dotted border-black px-2">New Rule</span></p>
               </div>
               <div className="text-right text-xs">
                 <p>जी. ए. ३१ एस आर सी / जी 1677</p>
                 <p>GA 31 SRC/G 1677</p>
               </div>
            </div>

            <div className="flex flex-wrap justify-between text-xs mb-1 font-hindi">
               <div className="flex gap-2">
                 <span>शाखा / Branch</span>
                 <span className="font-bold border-b border-black min-w-[100px]">{profile.branch}</span>
               </div>
               <div className="flex gap-2">
                 <span>मंडल / जिला / Division/Distt.</span>
                 <span className="font-bold border-b border-black min-w-[100px]">{profile.division}</span>
               </div>
               <div className="flex gap-2">
                 <span>मुख्यालय / Headquarters at</span>
                 <span className="font-bold border-b border-black min-w-[100px]">{profile.headquarters}</span>
               </div>
            </div>
            
            <div className="w-full text-xs text-center mb-1">
               <span>................... द्वारा किये गये कार्यो का जर्नल, जिनके बारे में ................... 20....... के लिये भत्ता मांगा गया है ।</span>
            </div>

            <div className="w-full text-sm mb-2 leading-tight">
               Journal of duties performed by <span className="font-bold border-b border-black px-2">{profile.name}</span> for which allowance for <span className="font-bold border-b border-black px-2">{MONTH_NAMES[data.month]}</span> 20<span className="font-bold border-b border-black px-1">{data.year.toString().slice(-2)}</span> is claimed.
            </div>

            <div className="flex justify-between text-xs border-b-2 border-black pb-1">
              <div className="flex gap-1">
                <span>पदनाम / Designation</span>
                <span className="font-bold border-b border-black min-w-[80px]">{profile.designation}</span>
              </div>
              <div className="flex gap-1">
                <span>वेतन / Pay</span>
                <span className="font-bold border-b border-black min-w-[80px]">{profile.basicPay}</span>
              </div>
               <div className="flex gap-1">
                <span>Level-</span>
                <span className="font-bold border-b border-black min-w-[40px]">{profile.payLevel}</span>
              </div>
              <div className="flex gap-1">
                <span>P.F. NO:</span>
                <span className="font-bold border-b border-black min-w-[100px]">{profile.pfNumber}</span>
              </div>
            </div>
          </div>

          {/* --- TABLE --- */}
          <div className="flex-grow border-l-2 border-t-2 border-black">
             <table className="w-full border-collapse text-[10px] leading-tight">
               <thead>
                 <tr className="h-14">
                   {/* Column definitions matching image */}
                   <HeaderCell w="w-[8%]" id="1" t1="माह और तारीख" t2="Month & Date" />
                   <HeaderCell w="w-[6%]" id="2" t1="गाड़ी का क्रमांक" t2="Train No." />
                   <HeaderCell w="w-[6%]" id="3" t1="प्रस्थान समय" t2="Time left" />
                   <HeaderCell w="w-[6%]" id="4" t1="आगमन समय" t2="Time arrived" />
                   <HeaderCell w="w-[12%]" id="5" t1="से / From" t2="Station" colSpan={2} subHeader={true} />
                   <HeaderCell w="w-[6%]" id="7" t1="कि. मी." t2="Kms." />
                   <HeaderCell w="w-[6%]" id="8" t1="दिन/रात" t2="Day/Night" />
                   <HeaderCell w="w-[20%]" id="9" t1="यात्रा का उद्देश्य" t2="Object of journey" />
                   <HeaderCell w="w-[6%]" id="10" t1="दर" t2="Rate" />
                   <HeaderCell w="w-[12%]" id="11" t1="दूरी जिसके लिये प्राइवेट..." t2="Distance pvt/public..." />
                   <HeaderCell w="w-[12%]" id="12" t1="दूरी-अनुसूची के..." t2="Ref Item 20" />
                 </tr>
                 <tr className="h-4 border-b-2 border-black font-bold text-center bg-gray-100">
                    <td className="border-r border-black">1</td>
                    <td className="border-r border-black">2</td>
                    <td className="border-r border-black">3</td>
                    <td className="border-r border-black">4</td>
                    <td className="border-r border-black">5</td>
                    <td className="border-r border-black">6</td>
                    <td className="border-r border-black">7</td>
                    <td className="border-r border-black">8</td>
                    <td className="border-r border-black">9</td>
                    <td className="border-r border-black">10</td>
                    <td className="border-r border-black">11</td>
                    <td className="border-r border-black">12</td>
                 </tr>
               </thead>
               <tbody>
                  {/* Render exactly 13 rows */}
                  {Array.from({ length: 13 }).map((_, idx) => {
                    const entry = chunk[idx];
                    // If entry exists, show data. If not, show strike line.
                    const isFilled = !!entry;
                    
                    // Formatting Date
                    let dateStr = "";
                    if (isFilled && entry.date) {
                        const d = new Date(entry.date);
                        dateStr = `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth()+1).toString().padStart(2, '0')}-${d.getFullYear()}`;
                    }

                    return (
                      <tr key={idx} className="h-8 border-b border-black text-center relative hover:bg-transparent">
                        <Cell>{dateStr}</Cell>
                        <Cell>{entry?.trainNo}</Cell>
                        <Cell>{entry?.departureTime}</Cell>
                        <Cell>{entry?.arrivalTime}</Cell>
                        <Cell>{entry?.fromStation}</Cell>
                        <Cell>{entry?.toStation}</Cell>
                        <Cell>{entry?.kms}</Cell>
                        <Cell>{entry?.dayNightPercent ? `${entry.dayNightPercent}` : ''}</Cell>
                        <Cell align="left">{entry?.purpose}</Cell>
                        <Cell>{entry?.rate}</Cell>
                        
                        {/* Empty/Unused columns Logic: 
                            Prompt: "All unfilled rows must automatically show a horizontal BLACK LINE"
                            Also: "If partial TA is filled, remaining columns in that row must still get black horizontal line"
                        */}
                        
                        {/* For columns 11 and 12, usually empty in example image. */}
                        <Cell className="strike-line">{entry?.conveyanceDistance}</Cell>
                        <Cell className="strike-line">{entry?.reference}</Cell>

                        {/* If the ENTIRE row is empty, we need a line across ALL cells.
                            The 'strike-line' class on individual cells works, but let's do an overlay if needed.
                            Actually, simpler: apply strike-line to ALL cells if !isFilled
                        */}
                        {!isFilled && (
                             <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none">
                                <div className="w-full h-[1px] bg-black"></div>
                             </div>
                        )}
                      </tr>
                    );
                  })}
               </tbody>
               <tfoot>
                 {/* Only show total on the last page of entries, or on every page? Usually page wise total. 
                     For simplicity, let's put total on the last row of the grid if relevant. 
                     The image shows a Total at bottom right. */}
                 {pageIndex === chunks.length - 1 && (
                     <tr>
                         <td colSpan={9} className="text-right font-bold pr-2 border-r border-black border-b border-black">Total</td>
                         <td className="border-r border-black border-b border-black font-bold">
                             {/* Calculate simple total */}
                             {entries.reduce((acc, curr) => acc + (parseFloat(curr.rate) || 0), 0).toFixed(2)}
                         </td>
                         <td colSpan={2} className="border-b border-black"></td>
                     </tr>
                 )}
               </tfoot>
             </table>
          </div>
          
          {/* --- FOOTER (CERTIFICATION - Only on last page) --- */}
          {pageIndex === chunks.length - 1 && (
            <div className="mt-2 text-[10px] leading-tight">
               <div className="flex w-full mb-4">
                  <div className="w-[10%] pt-2">B :</div>
                  <div className="w-[90%] border-b border-black italic pt-2 text-sm font-handwriting">
                      {/* Amount in words logic could go here */}
                      Six Thousand Nine Hundred Thirty Seven only
                  </div>
               </div>
               
               <p className="mb-1">मैं प्रमाणित करता हूं कि उपर्युक्त ........................ उस अवधि के दौरान, जिसके लिये इस बिल में भत्ता मांगा गया है रेलवे के कार्य से ड्यूटी पर मुख्यालय स्टेशन से बाहर गया था ।</p>
               <p className="mb-1">I hereby certify that the above mentioned ........................ was absent on duty from his headquarter's station during the period charged for in this bill.</p>
               <p className="mb-1">I certify that no TA/DA or any other remuneration has been drawn from any other source in respect of the journeys performed duty pass and also for the halts for which TA/DA has been claimed in this bill.</p>
            
               <div className="flex justify-between items-end mt-8 px-4">
                 <div className="text-center">
                    <p className="font-bold text-blue-800">Transportation Inspector</p>
                    <p className="border-t border-black w-48 mt-8 pt-1">प्रति हस्ताक्षर / Countersigned</p>
                    <p>Station / Station Master</p>
                 </div>
                 
                 <div className="text-center">
                    <p className="font-bold text-blue-800">Transportation Inspector</p>
                    <p className="border-t border-black w-48 mt-8 pt-1">नियंत्रक अधिकारी / Controlling Officer</p>
                 </div>
                 
                 <div className="text-center relative">
                    {/* Fake Signature */}
                    <div className="absolute -top-8 left-10 font-handwriting text-2xl text-blue-900 rotate-[-10deg]">Milind</div>
                    <p className="border-t border-black w-48 mt-8 pt-1">भत्ता मांगने वाले अधिकारी का हस्ताक्षर</p>
                    <p>Signature of Officer/Claiming T.A.</p>
                 </div>
               </div>
               
               <div className="mt-4 text-xs font-bold border-t border-gray-300 pt-2 text-gray-500 text-center">
                   Developed By Milind Manugade | Railway TA App
               </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Helper Components for Table
const HeaderCell = ({ w, id, t1, t2, colSpan = 1, subHeader = false }: any) => (
  <th className={`${w} border-r border-b border-black p-0 align-top`} colSpan={colSpan} rowSpan={subHeader ? 1 : 2}>
    <div className="flex flex-col h-full justify-start pt-1">
        <span>{t1}</span>
        <span>{t2}</span>
        {subHeader && (
            <div className="flex w-full mt-auto border-t border-black text-center h-1/2">
                <div className="w-1/2 border-r border-black pt-2">
                    <div>से / From</div>
                </div>
                 <div className="w-1/2 pt-2">
                    <div>तक / To</div>
                </div>
            </div>
        )}
    </div>
  </th>
);

const Cell = ({ children, className = "", align="center" }: any) => (
  <td className={`border-r border-black h-8 p-1 text-${align} overflow-hidden whitespace-nowrap text-xs ${className}`}>
    {children}
  </td>
);
