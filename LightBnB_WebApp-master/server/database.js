const properties = require("./json/properties.json");
const users = require("./json/users.json");
const { Pool } = require("pg");

const pool = new Pool({
  user: "vagrant",
  password: "123",
  host: "localhost",
  database: "lightbnb",
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function (email) {
  return pool
    .query(`SELECT * FROM users WHERE email = $1;`, [email])
    .then((result) => {
      if (result.rows.length > 0) {
        return result.rows[0]; // Use index to get the object in array
      }
      return null;
    })
    .catch((err) => {
      console.log(err.message);
    });
};
// console.log(getUserWithEmail("jordan@gmail.com"));

exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function (id) {
  return pool
    .query(`SELECT * FROM users WHERE id = $1;`, [id])
    .then((result) => {
      if (result.rows.length > 0) {
        return result.rows[0]; // Use index to get the object in array
      }
      return null;
    })
    .catch((err) => {
      console.log(err.message);
    });
};
// console.log(getUserWithId(256))
exports.getUserWithId = getUserWithId;

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function (user) {
  return pool
    .query(
      `INSERT INTO users (name, email, password) 
            VALUES ($1, $2, $3)
            RETURNING *`,
      [user.name, user.email, user.password]
    )
    .then((result) => {
      return result.rows[0]; // Use index to get the object in array
    })
    .catch((err) => {
      console.log(err.message);
    });
};
// console.log(addUser({name: 'Eddie', password: '123', email: 'bowser@gmail.com'}))
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function (guest_id, limit = 10) {
  return pool
    .query(
      `SELECT reservations.*, properties.*, reservations.*
          FROM reservations
          JOIN properties ON reservations.property_id = properties.id
          JOIN property_reviews ON properties.id = property_reviews.property_id
          WHERE reservations.guest_id = $1
          GROUP BY properties.id, reservations.id
          ORDER BY reservations.start_date
          LIMIT $2;`,
      [guest_id, limit]
    )
    .then((result) => {
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};
// console.log(getAllReservations(5))
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function (options, limit = 10) {
  const queryParams = [];

  let queryString = `
    SELECT properties.*, avg(property_reviews.rating) as average_rating
    FROM properties
    JOIN property_reviews ON properties.id = property_reviews.property_id
  `;

  // Check if city passed in options object
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
  }

  if (options.owner_id) {
    queryParams.push(options.owner_id);
    queryString += `AND owner_id = $${queryParams.length} `;
  }

  if (options.minimum_price_per_night) {
    queryParams.push(options.minimum_price_per_night);
    queryString += `AND cost_per_night >= $${queryParams.length} `;
  }
  
  if (options.maximum_price_per_night) {
    queryParams.push(options.maximum_price_per_night);
    queryString += `AND cost_per_night <= $${queryParams.length} `;
  }
  
  if (options.minimum_rating ) {
    queryParams.push(options.minimum_rating);
    queryString += `AND rating >= $${queryParams.length} `;
  }
  console.log(queryString, "\n params: ", queryParams);

  queryParams.push(limit);
  queryString += `
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  return pool
  .query(queryString, queryParams)
  .then((result) => {
    return result.rows;
  })
  .catch((err) => {
    console.log(err.message);
  });
};
// console.log(getAllProperties({minimum_rating: 3}));
exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function (property) {
  const queryParams = [property.owner_id, property.title, property.description, property.thumbnail_photo_url, property.cover_photo_url, property.cost_per_night, property.parking_spaces, property.number_of_bathrooms, property.number_of_bedrooms, property.country, property.street, property.city, property.province, property.post_code, property.active]

  const queryString = `INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
  RETURNING *;`

  return pool
    .query(queryString, queryParams)
    .then((result) => {
      console.log(result.rows)
      return result.rows;
    })
    .catch((err) => {
      console.log(err.message);
    });
};
// console.log(addProperty({owner_id: 1, title: 'message', description:'message', thumbnail_photo_url: 'message', cover_photo_url: 'message', cost_per_night: 10000, parking_spaces: 1, number_of_bathrooms: 1, number_of_bedrooms: 1, country: 'Canada', street: 'Buckhorn', city: 'Oakville', province: 'Ontario', post_code: 'l8b0b7', active: true}))
exports.addProperty = addProperty;
