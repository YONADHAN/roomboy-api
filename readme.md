Dynamic Validation Flow (VERY IMPORTANT)

Before saving property:

1. Fetch FieldDefinitions for entityType = "property"
2. Loop through required fields
3. Validate:
   - required
   - dataType
   - min/max
   - options
4. Reject invalid fields
5. Save only allowed attributes

📌 Validation happens in Service layer, not schema.
