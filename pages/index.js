// '/page/index.js'
import Featured from "@/components/Featured";
import NewProducts from "@/components/NewProducts";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";
import Script from "next/script";

// const crypto = require('crypto');

// const secret = '35bw1kap0u9ndgswu53267dif34fd3r5';
// const userId = current_user.id // A string UUID to identify your user

// const hash = crypto.createHmac('sha256', secret).update(userId).digest('hex');

export default function HomaPage ({featuredProduct,newProducts}) {
  const chatbaseScript = `
    (function(){if(!window.chatbase||window.chatbase("getState")!=="initialized"){window.chatbase=(...arguments)=>{if(!window.chatbase.q){window.chatbase.q=[]}window.chatbase.q.push(arguments)};window.chatbase=new Proxy(window.chatbase,{get(target,prop){if(prop==="q"){return target.q}return(...args)=>target(prop,...args)}})}const onLoad=function(){const script=document.createElement("script");script.src="https://www.chatbase.co/embed.min.js";script.id="rTP9eFsJni_pno-IHtZX7";script.domain="www.chatbase.co";document.body.appendChild(script)};if(document.readyState==="complete"){onLoad()}else{window.addEventListener("load",onLoad)}})();
  `;

  return (
    <div>
      <Featured product={featuredProduct}/>
      <NewProducts products={newProducts} />

      <div dangerouslySetInnerHTML={{ __html: `<script>${chatbaseScript}</script>` }} />
      
      {/* <script>
        window.chatbaseConfig = {
          user_id: <USER_ID>,
          user_hash: <USER_HASH>,
            user_metadata: {
              "name": "John Doe",
              "email": "john@example.com",
              "company": "Acme Inc",
          }
        }
      </script> */}

      {/* <script>
      (function(){if(!window.chatbase||window.chatbase("getState")!=="initialized"){window.chatbase=(...arguments)=>{if(!window.chatbase.q){window.chatbase.q=[]}window.chatbase.q.push(arguments)};window.chatbase=new Proxy(window.chatbase,{get(target,prop){if(prop==="q"){return target.q}return(...args)=>target(prop,...args)}})}const onLoad=function(){const script=document.createElement("script");script.src="https://www.chatbase.co/embed.min.js";script.id="rTP9eFsJni_pno-IHtZX7";script.domain="www.chatbase.co";document.body.appendChild(script)};if(document.readyState==="complete"){onLoad()}else{window.addEventListener("load",onLoad)}})();
      </script> */}

    </div>
  );
}

export async function getServerSideProps() {
  const featuredProductId = '68a7341cfe8b317b91b3a275';
  await mongooseConnect();
  const featuredProduct = await Product.findById(featuredProductId);
  const newProducts = await Product.find({}, null, {sort: {'_id':-1}, limit:10});
  return {
    props: {featuredProduct: JSON.parse(JSON.stringify(featuredProduct)),
      newProducts: JSON.parse(JSON.stringify(newProducts)),
    },
  };
}