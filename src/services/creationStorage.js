
const DB_NAME = 'BraynexAI';
const DB_VERSION = 1;
const STORE_NAME = 'creations';

// Open IndexedDB
const openDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: 'id',
          autoIncrement: true,
        });

        store.createIndex('imageId', 'imageId', { unique: false });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

// Save Generated Image
export const saveCreation = async (creation) => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const request = store.add({
      ...creation,
      favorite: false,
      createdAt: new Date().toISOString(),
    });

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);

    transaction.oncomplete = () => db.close();
    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };
  });
};

// Get All Generated Images
export const getAllCreations = async () => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const request = transaction.objectStore(STORE_NAME).getAll();

    request.onsuccess = () => {
      resolve(request.result.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      ));
    };

    request.onerror = () => reject(request.error);

    transaction.oncomplete = () => db.close();
  });
};

// Delete Generated Image
export const deleteCreation = async (id) => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const request = transaction.objectStore(STORE_NAME).delete(id);

    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(request.error);

    transaction.oncomplete = () => db.close();
  });
};

// Toggle Favorite
export const toggleCreationFavorite = async (id) => {
  const db = await openDatabase();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const getRequest = store.get(id);

    getRequest.onsuccess = () => {
      const creation = getRequest.result;

      if (!creation) {
        reject(new Error('Creation not found.'));
        return;
      }

      creation.favorite = !creation.favorite;
      store.put(creation);
      resolve(creation.favorite);
    };

    getRequest.onerror = () => reject(getRequest.error);
    transaction.oncomplete = () => db.close();
  });
};
