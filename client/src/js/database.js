import { openDB } from 'idb';

const initdb = async () =>
  openDB('jate', 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains('jate')) {
        console.log('jate database already exists');
        return;
      }
      db.createObjectStore('jate', { keyPath: 'id', autoIncrement: true });
      console.log('jate database created');
    },
  });

// TODO: Add logic to a method that accepts some content and adds it to the database
export const putDb = async (content) => { 
  console.log('Successfully put to the database!');
  const jateDB = await openDB('jate', 1);
  const tx = jateDB.transaction('jate', "readwrite") // Making sure we can have read / write access
  const store = tx.objectStore('jate');
  const request = store.put({ id: 1, value: content});
  const results = await request;

  console.log('- data has been saved to the database!', result.value)
  console.error('putDb not implemented')
};

// TODO: Add logic for a method that gets all the content from the database
export const getDb = async () => {
  console.log('GET from the database successful!')
  const jateDB = await openDB('jate', 1);
  const tx = jateDB.transaction('jate', 'readonly'); //ensure the permission here is read only since its a GET request
  const store = tx.objectStore('jate');
  const request = store.get(1);
  const results = await request;

  results ? console.log('- data has been successfully retrieved from the database', result.value) :
  console.log('- data was not found in the database');
  return results?.value
};

initdb();
