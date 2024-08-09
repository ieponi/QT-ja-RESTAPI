#include "mainwindow.h"
#include "ui_mainwindow.h"
#include <QNetworkRequest>
#include <QUrl>
#include <QJsonDocument>
#include <QJsonArray>
#include <QJsonObject>
#include <QDebug>

MainWindow::MainWindow(QWidget *parent)
    : QMainWindow(parent)
    , ui(new Ui::MainWindow)
    , networkManager(new QNetworkAccessManager(this))
    , model(new QStandardItemModel(this))
{
    ui->setupUi(this);

    ui->tableView->setModel(model);

    connect(networkManager, &QNetworkAccessManager::finished,
            this, &MainWindow::onNetworkReply);
    connect(ui->addCarButton, &QPushButton::clicked,
            this, &MainWindow::onAddCarButtonClicked);

    // Aluksi haetaan kaikki autot
    fetchCars();
}

MainWindow::~MainWindow()
{
    delete ui;
}

void MainWindow::fetchCars()
{
    QUrl url("http://localhost:3000/cars");
    QNetworkRequest request(url);

    networkManager->get(request);
}

void MainWindow::onNetworkReply(QNetworkReply *reply)
{
    if (reply->error() == QNetworkReply::NoError) {
        QByteArray responseData = reply->readAll();
        QJsonDocument jsonDoc = QJsonDocument::fromJson(responseData);
        QJsonArray jsonArray = jsonDoc.array();

        model->clear();
        model->setHorizontalHeaderLabels({"ID", "Branch", "Model"});
        fetchCars();
        for (const QJsonValue &value : jsonArray) {
            QJsonObject obj = value.toObject();
            QList<QStandardItem *> rowItems;
            rowItems.append(new QStandardItem(QString::number(obj["id_car"].toInt())));
            rowItems.append(new QStandardItem(obj["branch"].toString()));
            rowItems.append(new QStandardItem(obj["model"].toString()));
            model->appendRow(rowItems);
        }
    } else {
        qDebug() << "Error:" << reply->errorString();
    }

    reply->deleteLater();
}

void MainWindow::onAddCarButtonClicked()
{
    QString branch = ui->branchLineEdit->text();
    QString model = ui->modelLineEdit->text();

    if (branch.isEmpty() || model.isEmpty()) {
        qDebug() << "Branch tai model puuttuu!";
        return;
    }

    QUrl url("http://localhost:3000/cars");
    QNetworkRequest request(url);
    request.setHeader(QNetworkRequest::ContentTypeHeader, "application/json");

    QJsonObject jsonObj;
    jsonObj["branch"] = branch;
    jsonObj["model"] = model;
    QJsonDocument jsonDoc(jsonObj);
    QByteArray data = jsonDoc.toJson();

    networkManager->post(request, data);

}

