const elastic = require("../elastic");
const event = require("../schema/event");

module.exports = async function popularTags(bounds) {
  const tags = await elastic.search({
    index: event.index,
    body: {
      query: {
        bool: {
          filter: [
            {
              geo_bounding_box: {
                coordinates: {
                  top_left: [bounds.southwest.lng, bounds.northeast.lat],
                  bottom_right: [bounds.northeast.lng, bounds.southwest.lat]
                }
              }
            }
          ]
        }
      },
      size: 0,
      aggregations: {
        popularTags: {
          terms: { field: "tags", size: 50 }
        }
      },
      _source: false
    }
  });

  return tags.aggregations.popularTags.buckets.map(tag => ({
    text: tag.key,
    count: tag.doc_count
  }));
};
