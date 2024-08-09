#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>
#include <QNetworkAccessManager>
#include <QNetworkReply>
#include <QJsonDocument>
#include <QJsonArray>
#include <QJsonObject>
#include <QStandardItemModel>

QT_BEGIN_NAMESPACE
namespace Ui { class MainWindow; }
QT_END_NAMESPACE

class MainWindow : public QMainWindow
{
    Q_OBJECT

public:
    MainWindow(QWidget *parent = nullptr);
    ~MainWindow();

private slots:
    void onNetworkReply(QNetworkReply *reply);
    void onAddCarButtonClicked();

private:
    void fetchCars();
    Ui::MainWindow *ui;
    QNetworkAccessManager *networkManager;
    QStandardItemModel *model;
};
#endif // MAINWINDOW_H
