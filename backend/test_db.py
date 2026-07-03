from database import transactions_collection

print("Before insert")

transactions_collection.insert_one({
    "notes": "Test",
    "amount": 100
})

print("After insert")