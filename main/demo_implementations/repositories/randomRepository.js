// DATA
import "../../BLT/table/service/serviceDoc.js";
import { RandomNumber, RandomString } from "../../BLT/util/util.mjs";

/**
 * Creates a data set of persons
 * @constructor
 * @return ....
 */
const RandomRepository = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const cities = ["Tokyo", "Osaka", "Kyoto", "Kobe", "Nagano"];

    const generateData = batchSize => {
        const personsProxy = []
        for (let i = 0; i < batchSize; i++) {
            let person = {
                id: i+1,
                name: RandomString(characters, RandomNumber(3, 13)),
                age: RandomNumber(1, 80),
                age2: RandomNumber(1, 80),
                age3: RandomNumber(1, 80),
                age4: RandomNumber(1, 80),
                age5: RandomNumber(1, 80),
                city: cities[Math.floor(Math.random() * cities.length)],
            }
            personsProxy.push(person);
        }
        return personsProxy;
    }

    return {
        getData: size => generateData(size)
    }
}

export { RandomRepository }