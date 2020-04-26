const t = {
  ...require('assert'),
  //Steal assert lib from pico-check  
};


module.exports = {

  'this is a test' : (t)=>{
    t.ok(true);
  },
  '-This is a skipped test' : (t)=>{
    t.fail()
  },
  '+ This is an only test' : (t)=>{
  
  },
  
  'Group' : {
    '- nested skip' : async (t)=>{}
  }



const hasOnly = (tests)=>{
  Loop through each and check for any only flags (starst with '+')
}


const run = (tests)=>{
  

}
