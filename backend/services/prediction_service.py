from model_loader import model

def predict_category(notes, payment_mode, location):

    text = (
        notes
        + " "
        + payment_mode
        + " "
        + location
    )

    prediction = model.predict([text])[0]

    return prediction