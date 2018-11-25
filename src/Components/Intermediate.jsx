class Intermediate {
  static Memory = new Object();

  static store(key, value){
    console.log("Store", key, value);
    Intermediate.Memory[key] = value;
  }

  static retrieve(key){
    if(Object.keys(Intermediate.Memory).includes(key) < 0) return false;
    return Intermediate.Memory[key];
  }

  static remove(key){
    delete(Intermediate.Memory[key]);
  }
}
export default Intermediate;
