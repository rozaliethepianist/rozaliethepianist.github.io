/* QR byte-mode encoder, versions 1–6, error correction L. No network or dependencies. */
(() => {
 'use strict';
 const blocks=[[26,19,1],[44,34,1],[70,55,1],[100,80,1],[134,108,1],[86,68,2]];
 function matrix(text){
  const bytes=new TextEncoder().encode(text);
  const version=blocks.findIndex(([,data,count])=>bytes.length*8+12<=data*count*8)+1;
  if(!version)throw new RangeError('QR URL exceeds 134 UTF-8 bytes. Use a shorter URL.');
  const [total,data,count]=blocks[version-1],capacity=data*count,bits=[];
  const put=(value,length)=>{for(let i=length-1;i>=0;i--)bits.push((value>>>i)&1)};
  put(4,4);put(bytes.length,8);for(const b of bytes)put(b,8);
  put(0,Math.min(4,capacity*8-bits.length));while(bits.length%8)bits.push(0);
  const words=[];for(let i=0;i<bits.length;i+=8)words.push(bits.slice(i,i+8).reduce((v,b)=>(v<<1)|b,0));
  for(let i=0;words.length<capacity;i++)words.push(i%2?0x11:0xec);
  const exp=new Uint8Array(512),log=new Uint8Array(256);let x=1;
  for(let i=0;i<255;i++){exp[i]=x;log[x]=i;x<<=1;if(x&256)x^=0x11d}for(let i=255;i<512;i++)exp[i]=exp[i-255];
  const mul=(a,b)=>a&&b?exp[log[a]+log[b]]:0;
  const ecc=total-data;let gen=[1];
  for(let i=0;i<ecc;i++){const next=Array(gen.length+1).fill(0);gen.forEach((g,j)=>{next[j]^=g;next[j+1]^=mul(g,exp[i])});gen=next}
  const ds=[],es=[];
  for(let b=0;b<count;b++){const d=words.slice(b*data,(b+1)*data),work=d.concat(Array(ecc).fill(0));for(let i=0;i<data;i++){const f=work[i];if(f)for(let j=0;j<gen.length;j++)work[i+j]^=mul(f,gen[j])}ds.push(d);es.push(work.slice(data))}
  const stream=[];for(let i=0;i<data;i++)for(let b=0;b<count;b++)stream.push(ds[b][i]);for(let i=0;i<ecc;i++)for(let b=0;b<count;b++)stream.push(es[b][i]);
  const n=17+4*version,m=Array.from({length:n},()=>Array(n).fill(null));
  for(const [r,c] of [[0,0],[n-7,0],[0,n-7]])for(let y=-1;y<=7;y++)for(let z=-1;z<=7;z++){const a=r+y,b=c+z;if(a<0||b<0||a>=n||b>=n)continue;m[a][b]=y>=0&&y<7&&z>=0&&z<7&&(y===0||y===6||z===0||z===6||(y>=2&&y<=4&&z>=2&&z<=4))}
  if(version>1)for(const r of [6,n-7])for(const c of [6,n-7]){if(m[r][c]!==null)continue;for(let y=-2;y<=2;y++)for(let z=-2;z<=2;z++)m[r+y][c+z]=Math.max(Math.abs(y),Math.abs(z))!==1}
  for(let i=8;i<n-8;i++){if(m[i][6]===null)m[i][6]=i%2===0;if(m[6][i]===null)m[6][i]=i%2===0}
  let remainder=8<<10;for(let i=14;i>=10;i--)if(remainder&(1<<i))remainder^=0x537<<(i-10);const format=((8<<10)|remainder)^0x5412;
  for(let i=0;i<15;i++){const bit=!!((format>>>i)&1);m[i<6?i:i<8?i+1:n-15+i][8]=bit;m[8][i<8?n-i-1:i<9?15-i:15-i-1]=bit}m[n-8][8]=true;
  let row=n-1,dir=-1,index=0;
  for(let col=n-1;col>0;col-=2){if(col===6)col--;while(true){for(let j=0;j<2;j++){const c=col-j;if(m[row][c]!==null)continue;const bit=index<stream.length*8?((stream[index>>>3]>>>(7-index%8))&1):0;index++;m[row][c]=!!(bit^((row+c)%2===0?1:0))}row+=dir;if(row<0||row>=n){row-=dir;dir=-dir;break}}}
  return m;
 }
 function svg(text){const m=matrix(text),size=m.length+8;let path='';m.forEach((row,y)=>row.forEach((dark,x)=>{if(dark)path+=`M${x+4} ${y+4}h1v1h-1z`}));return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="1024" height="1024" shape-rendering="crispEdges"><path fill="#fff" d="M0 0h${size}v${size}H0z"/><path fill="#000" d="${path}"/></svg>`}
 window.RozalieQR={matrix,svg};
})();
